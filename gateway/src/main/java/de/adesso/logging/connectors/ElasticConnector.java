package de.adesso.logging.connectors;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.IndicesClient;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.CreateIndexRequest;
import org.elasticsearch.client.indices.CreateIndexResponse;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.elasticsearch.client.indices.GetMappingsRequest;
import org.elasticsearch.client.indices.GetMappingsResponse;
import org.elasticsearch.cluster.metadata.MappingMetaData;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.QueryStringQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.aggregations.Aggregation;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.Aggregations;
import org.elasticsearch.search.aggregations.bucket.range.DateRangeAggregationBuilder;
import org.elasticsearch.search.aggregations.bucket.range.ParsedDateRange;
import org.elasticsearch.search.aggregations.bucket.range.Range;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("elastic")
public class ElasticConnector implements SearchConnector {
	
	class ResponseContainer {
		SearchResponse response;
	}
	
	
	private static final int ELASTIC_TIMEOUT = 500;

	private static final Logger logger = LoggerFactory.getLogger(ElasticConnector.class);

    @Value("${elastic.collection}")
    private String loggingCollectionName;

    @Value("${elastic.collection_comments}")
    private String commentsCollectionName;

    @Value("${elastic.collection_usersettings}")
    private String usersettingsCollectionName;

    @Value("${elastic.fields_enabled}")
    private boolean fieldsEnabled;

    private final String timePattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX";

    // collections with names and if existence has been confirmed
    private Map<String, Boolean> collections = new HashMap<>();

    private boolean collectionsCreated = false;

    @Autowired
    private RestHighLevelClient elasticClient;


    @Override
    public String getConnectorName() {
        if (fieldsEnabled) {
            return "Elastic (Fields enabled)";
        } else {
            return "Elastic (Fields disabled)";
        }
    }

    @Override
    public String getDocument(String collection, String id) {
        GetRequest request = new GetRequest(collection, id);
        GetResponse response = null;
        try {
            response = elasticClient.get(request, RequestOptions.DEFAULT);
        } catch (IOException e) {
            logger.warn("Unable to find document cause of exception", e);
        }
        if (fieldsEnabled)
            return new JSONObject().put("id", response.getId()).put("log", response.getSource().get("fields"))
                    .toString();
        else
            return new JSONObject().put("id", response.getId()).put("log", response.getSource()).toString();
    }

    @Override
    public String getFilteredDocuments(String collection, Map<String, Object> body) {
        checkAndCreateCollections();

        SearchSourceBuilder builder = new SearchSourceBuilder();
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        builder.trackTotalHits(true);

        if (body.containsKey("searchText")) {
            String searchText = (String) body.get("searchText");
            if (!searchText.equals("*:*")) {
                // QueryBuilder matchQuery = QueryBuilders.multiMatchQuery(
                // searchText);
                // //builder = builder.postFilter(matchQuery);
                // boolQuery.must(matchQuery);

                QueryStringQueryBuilder searchTextQuery = QueryBuilders.queryStringQuery(searchText);
                boolQuery.must(searchTextQuery);
            }

        }

        builder.from((Integer) body.getOrDefault("start", 0));

        if (body.containsKey("time")) {
            ArrayList<String> time = (ArrayList<String>) body.get("time");
            // RangeQueryBuilder rangeQuery = new RangeQueryBuilder("time");

            LocalDateTime startTime = LocalDateTime.parse(time.get(0), DateTimeFormatter.ISO_DATE_TIME);
            LocalDateTime endTime = LocalDateTime.parse(time.get(1), DateTimeFormatter.ISO_DATE_TIME);
            if (fieldsEnabled)
                boolQuery.must(QueryBuilders.rangeQuery("fields.time").gte(startTime).to(endTime));
            else
                boolQuery.must(QueryBuilders.rangeQuery("time").gte(startTime).to(endTime));
            // QueryBuilders.rangeQuery("time").from(time.get(0)).to(time.get(1));
            // builder.postFilter(rangeQuery);

        }

        if (body.containsKey("fields")) {
            ArrayList<String> fl = (ArrayList<String>) body.get("fields");
            if (fieldsEnabled) {
                String[] arr = fl.stream().map((x) -> "fields." + x).toArray(String[]::new);
                builder.fetchSource(arr, null);
            } else {
                String[] arr = fl.stream().toArray(String[]::new);
                builder.fetchSource(arr, null);
            }
        }

        // todo minCount, maxCount, offset, contains (elastic search seems to not
        // support that)
        if (body.containsKey("facets")) {

            LinkedHashMap facets = (LinkedHashMap) body.getOrDefault("facets", null);
            boolean facetOn = (Boolean) facets.get("facetOn");
            int minCount = (Integer) facets.getOrDefault("minCount", 0);
            int maxCount = (Integer) facets.getOrDefault("maxCount", 10);
            ArrayList<String> fields = (ArrayList<String>) facets.getOrDefault("fields", null);

            String offset = String.valueOf(facets.getOrDefault("offset", ""));
            String contains = (String) facets.getOrDefault("contains", "");

            if (facetOn && fields != null) {
                for (String field : fields) {
                    TermsAggregationBuilder agg;
                    if (fieldsEnabled)
                        agg = AggregationBuilders.terms(field).field("fields." + field + ".keyword");
                    else
                        agg = AggregationBuilders.terms(field).field(field + ".keyword");
                    agg.minDocCount(minCount);
                    agg.size(maxCount);
                    builder.aggregation(agg);
                }
            }

        }

        if (body.containsKey("facetsRange")) {
            DateFormat df = new SimpleDateFormat(timePattern);

            LinkedHashMap facetsRange = (LinkedHashMap) body.get("facetsRange");

            LocalDateTime start = null;
            LocalDateTime end = null;
            String interval = null;
            start = LocalDateTime.parse((String) facetsRange.get("rangeStart"),
                    DateTimeFormatter.ofPattern(timePattern));
            end = LocalDateTime.parse((String) facetsRange.get("rangeEnd"), DateTimeFormatter.ofPattern(timePattern));
            interval = (String) facetsRange.get("rangeGap");

            int numSeconds = Integer.valueOf(interval.replaceAll("\\D+", ""));

            List<LocalDateTime> totalDates = new ArrayList<>();
            while (!start.isAfter(end)) {
                totalDates.add(start);
                start = start.plusSeconds(numSeconds);
            }

            totalDates.add(end);

            // UTC

            // solr
            // DateTimeFormatter.ISO_INSTANT
            // String -> date -> String
            Map<String, Object> metaData = new HashMap<>();
            metaData.put("format", DateTimeFormatter.ISO_DATE);
            // System.out.println(totalDates.get(0).toString());
            DateRangeAggregationBuilder agg;
            if (fieldsEnabled)
                agg = AggregationBuilders.dateRange("time").field("fields.time");
            else
                agg = AggregationBuilders.dateRange("time").field("time");
            for (int i = 1; i < totalDates.size() - 1; i++) {
                agg.addRange(totalDates.get(i - 1).toString(), totalDates.get(i).toString());
            }

            // agg.timeZone(ZoneId.systemDefault())
            agg.keyed(true);
            // agg.subAggregation(AggregationBuilders.sum("counts"));
            builder.aggregation(agg);

        }

        if (body.containsKey("filters")) {
            ArrayList<HashMap> filters = (ArrayList<HashMap>) body.get("filters");
            for (HashMap filter : filters) {
                String key = (String) filter.get("key");

                BoolQueryBuilder subQuery = QueryBuilders.boolQuery();

                List<String> values = (List<String>) filter.get("values");
                if (!values.isEmpty()) {
                    for (String s : values) {
                        if (fieldsEnabled)
                            subQuery.should(QueryBuilders.matchPhraseQuery("fields." + key, s));
                        else
                            subQuery.should(QueryBuilders.matchPhraseQuery(key, s));
                    }

                }

                if ((boolean) filter.get("negated")) {
                    boolQuery.mustNot(subQuery);
                } else {
                    boolQuery.must(subQuery);
                }
            }

        }

        if (body.containsKey("markedIds")) {
            ArrayList<String> markedIds = (ArrayList<String>) body.get("markedIds");
            if (!markedIds.isEmpty()) {
                boolQuery.must(QueryBuilders.idsQuery().addIds(markedIds.toArray(new String[markedIds.size()])));
            }
        }

        if (body.containsKey("sort")) {
            ArrayList<HashMap> sorts = (ArrayList<HashMap>) body.get("sort");
            for (HashMap jo : sorts) {
                String f = (String) jo.get("field");
                if (!f.equals("time"))
                    f += ".keyword";
                if (!collection.equals(commentsCollectionName) && fieldsEnabled) {
                    f = "fields." + f;
                }
                // System.out.println(f);

                builder.sort(f, SortOrder.valueOf(((String) jo.get("direction")).toUpperCase()));
            }
        }

        if (body.containsKey("numRows")) {
            Integer numRows = (Integer) body.getOrDefault("numRows", 100);
            builder.size(numRows);
        }

        // boolQuery should now be complete
        builder.query(boolQuery);

        SearchRequest searchRequest = new SearchRequest(collection);
        searchRequest.searchType(SearchType.DFS_QUERY_THEN_FETCH);

        // add it!
        searchRequest.source(builder);

        // System.out.println(searchRequest);
        final ResponseContainer container = new ResponseContainer();
        JSONObject result = new JSONObject();
//            response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
    	
    	CountDownLatch waitForFinish = new CountDownLatch(1);

    	final AtomicBoolean failure = new AtomicBoolean(false);

        logger.info("Making async request: " + builder.toString());

        elasticClient.searchAsync(searchRequest, RequestOptions.DEFAULT, new ActionListener<SearchResponse>() {

			@Override
			public void onResponse(SearchResponse searchResponse) {
                logger.info("Received response: " + searchResponse.toString());

                container.response = searchResponse;
				waitForFinish.countDown();
				
			}

			@Override
			public void onFailure(Exception e) {
				failure.set(true);
				logger.warn("Unable to run request cause of exception", e);
				waitForFinish.countDown();
				
			}
		});
        
       
        
       boolean await = false;
		try {
			await = waitForFinish.await(ELASTIC_TIMEOUT, TimeUnit.SECONDS);
		} catch (InterruptedException e1) {
			Thread.currentThread().interrupt();
			logger.warn("Unable to run request cause of interrupt", e1);
		}
       
       if (!await || failure.get()) {
    	   // TODO Give the client a good, parsable exception
    	   logger.warn("No result from elastic, sending error message / empty response");
    	   return result.toString();
       }
       
       
       SearchResponse response = container.response;
        
        // System.out.println(response);

        SearchHits searchHits = response.getHits();
        result.put("totalResponseCount", searchHits.getTotalHits().value);
        // System.out.println(searchHits.getHits().length);
        result.put("docs", Arrays.stream(searchHits.getHits()).map((x) -> convertDocument(x)).toArray());

        if (response.getAggregations() != null)
            result.put("facets", convertAllFacets(response.getAggregations()));
        if (response.getAggregations() != null && response.getAggregations().get("time") != null)
            result.put("facetRanges", convertRangeFacet(response.getAggregations().get("time")));

        return result.toString();

    }

    @Override
    public String[] getSchemaFields(String collection) {
        checkAndCreateCollections();
        GetMappingsRequest request = new GetMappingsRequest();
        request.indices(collection);
        GetMappingsResponse getMappingResponse = null;
        try {
            getMappingResponse = elasticClient.indices().getMapping(request, RequestOptions.DEFAULT);
            Map<String, MappingMetaData> allMappings = getMappingResponse.mappings();
            MappingMetaData indexMapping = allMappings.get(collection);
            Map<String, Object> mapping = indexMapping.sourceAsMap();

            if (fieldsEnabled)
                return ((Map<String, Object>) ((Map<String, Object>) ((Map<String, Object>) mapping.get("properties"))
                        .get("fields")).get("properties")).keySet().toArray(String[]::new);
            else
                return ((Map<String, Object>) ((Map<String, Object>) mapping.get("properties"))).keySet()
                        .toArray(String[]::new);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public String addDocument(String collection, Map<String, Object> body) {
        UpdateRequest updateRequest = new UpdateRequest();
        updateRequest.docAsUpsert(true);
        updateRequest.index(collection);
        if (body.containsKey("id"))
            updateRequest.id((String) body.get("id"));
        updateRequest.doc(body);

        try {
            UpdateResponse response = elasticClient.update(updateRequest, RequestOptions.DEFAULT);
            return "{\"status\": 0}";
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";

    }

    @Override
    public String deleteDocument(String collection, String id) {
        DeleteRequest request = new DeleteRequest(collection, id);
        DeleteResponse response = null;
        try {
            // System.out.println(request.toString());
            response = elasticClient.delete(request, RequestOptions.DEFAULT);
            return "{\"status\": 0}";
        } catch (IOException e) {
            e.printStackTrace();
        }

        return "";
    }

    private JSONObject convertDocument(SearchHit hit) {

        Map<String, Object> source = (Map<String, Object>) hit.getSourceAsMap();
        Map<String, Object> doc;
        if (fieldsEnabled) {
            if (source.containsKey("fields")) { // normal docs
                doc = (Map<String, Object>) source.get("fields");
            } else { // usersettings and comments
                doc = source;
            }
        } else {
            if (source.containsKey("properties")) { // normal docs
                doc = (Map<String, Object>) source.get("properties");
            } else { // usersettings and comments
                doc = source;
            }
        }

        String id = hit.getId();
        doc.put("id", id);

        JSONObject json = new JSONObject(doc);
        json.put("id", hit.getId());

        return json;
    }

    private JSONArray convertAllFacets(Aggregations aggs) {

        JSONArray allFacets = new JSONArray();
        for (Aggregation agg : aggs) {
            if (!agg.getName().equals("time")) {
                Terms curr = (Terms) agg;

                JSONObject json = new JSONObject();
                json.put("name", curr.getName());

                List<JSONObject> elements = new ArrayList<>();
                for (Terms.Bucket fc : curr.getBuckets()) {
                    JSONObject internal = new JSONObject();
                    internal.put("value", fc.getKeyAsString());
                    internal.put("count", fc.getDocCount());
                    elements.add(internal);
                }

                json.put("elements", elements);
                allFacets.put(json);

            }
        }

        return allFacets;

    }

    private JSONObject convertRangeFacet(ParsedDateRange facet) {

        JSONObject json = new JSONObject();
        json.put("name", facet.getName());

        List<JSONObject> elements = new ArrayList<>();
        for (Range.Bucket fc : facet.getBuckets()) {
            JSONObject internal = new JSONObject();
            internal.put("value", fc.getFromAsString());
            internal.put("count", fc.getDocCount());
            elements.add(internal);
        }

        json.put("elements", elements);
        return json;
    }

    @Override
    public void checkAndCreateCollections() {
        if (collectionsCreated) {
            return;
        }

        // add collection names from properties
        addCollection(loggingCollectionName);
        addCollection(commentsCollectionName);
        addCollection(usersettingsCollectionName);

        IndicesClient client = elasticClient.indices();
        boolean everythingExists = true;
        for (Map.Entry<String, Boolean> collection : collections.entrySet()) {
            String collectionName = collection.getKey();
            boolean confirmed = collection.getValue();

            if (!confirmed) {
                // System.out.println(collectionName + " not confirmed, sending request");
                GetIndexRequest request = new GetIndexRequest(collectionName);

                try {

                    boolean exists = client.exists(request, RequestOptions.DEFAULT);
                    // System.out.println(collectionName + " exists?" + exists);
                    if (!exists) {
                        exists = createIndex(collectionName);
                    }
                    collection.setValue(exists);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (!collection.getValue()) {
                everythingExists = false;
            }
        }
        collectionsCreated = everythingExists;
    }

    private boolean createIndex(String name) {
        // System.out.println("Creating index..." + name);
        IndicesClient client = elasticClient.indices();
        CreateIndexRequest request = new CreateIndexRequest(name);
        Map<String, Object> properties = new HashMap<>();

        // add properties for collections here
        if (name.equals(usersettingsCollectionName)) {
            properties.put("creationtime", Map.of("type", "date"));
            properties.put("description", Map.of("type", "text"));
        } else if (name.equals(commentsCollectionName)) {
            properties.put("author", Map.of("type", "text"));
            properties.put("time", Map.of("type", "date"));
            properties.put("comment", Map.of("type", "text"));
            Map<String, Object> fields = new HashMap<>();
            fields.put("keyword", Map.of("type", "keyword", "ignore_above", 256));
            properties.put("creationtime", Map.of("type", "date", "fields", fields));
        } else if (name.equals(loggingCollectionName)) {
            // Map<String, Object> keyword = Map.of("type", "keyword", "ignore_above", 256);
            // Map<String, Object> fields = Map.of("keyword", keyword);
            // Map<String, Object> counterId = Map.of("type", "long", "fields", fields);
            Map<String, Object> time = Map.of("type", "date");
            // Map<String, Object> props = Map.of("counterId", counterId, "time", time);
            Map<String, Object> props = Map.of("time", time);

            Map<String, Object> fields2 = Map.of("properties", props);
            properties.put("fields", fields2);
        }

        if (!properties.isEmpty()) {
            Map<String, Object> mapping = new HashMap<>();
            mapping.put("properties", properties);
            request.mapping(mapping);
        }

        try {
            CreateIndexResponse createIndexResponse = client.create(request, RequestOptions.DEFAULT);
            return createIndexResponse.isAcknowledged();
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    private void addCollection(String name) {
        if (!collections.containsKey(name)) {
            this.collections.put(name, false);
        }
    }

}
