package de.adesso.logging.connectors;

import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.request.CollectionAdminRequest;
import org.apache.solr.client.solrj.request.schema.SchemaRequest;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.client.solrj.response.RangeFacet;
import org.apache.solr.client.solrj.response.schema.SchemaRepresentation;
import org.apache.solr.client.solrj.response.schema.SchemaResponse;
import org.apache.solr.common.SolrDocumentList;
import org.apache.solr.common.SolrInputDocument;
import org.eclipse.jetty.util.log.Log;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
@Profile("solr")
public class SolrConnector implements SearchConnector {


    @Autowired
    private SolrClient solrClient;

    private String timePattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX";

    @Override
    public String getConnectorName() {
        return "Solr";
    }

    @Override
    public String getDocument(String collection, String id) {
        //TODO
       // checkAndCreateCollections();

        SolrQuery query = new SolrQuery("id:" + id);
        query.setRows(1);

        QueryResponse response = null;
        try {
            response = solrClient.query(collection, query);
        } catch (SolrServerException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        SolrDocumentList documents = response.getResults();

        System.out.println(query.toQueryString() + " \nFound " + documents.getNumFound() + " documents");
        System.out.println(documents.get(0).toString());
        JSONObject log = null;
        if (!documents.isEmpty()) {
            log = new JSONObject(documents.get(0));

            // ISO instant
            log.put("time",new SimpleDateFormat(timePattern).format(documents.get(0).get("time")));
            return new JSONObject().put("id", id).put("log", log).toString();
        }

        return "";

    }

    @Override
    public String getFilteredDocuments(String collection, Map<String, Object> body) {
        System.out.println("GOT REQUEST!!" + collection + body);
        //TODO
        //checkAndCreateCollections();

        SolrQuery query = new SolrQuery();
        if (body.containsKey("searchText")) {
            String searchText = (String) body.get("searchText");
            if (!searchText.equals("*:*")) {
                query.setQuery("*" + searchText + "*");
            } else {
                query.setQuery("*:*");
            }
        } else {
            query.setQuery("*:*");
        }

        query.setStart((Integer) body.getOrDefault("start", 0));

        if (body.containsKey("time")) {
            ArrayList<String> time = (ArrayList<String>) body.get("time");
            query.addFilterQuery("time:[" + time.get(0) + " TO " + time.get(1) + "]");
        }

        if (body.containsKey("fields")) {
            ArrayList<String> fl = (ArrayList<String>) body.get("fields");
            query.addField(String.join(",", fl));
        }

        if (body.containsKey("facets")) {

            LinkedHashMap facets = (LinkedHashMap) body.get("facets");
            if(facets.containsKey("facetOn")) query.setFacet((Boolean) facets.get("facetOn"));
            if(facets.containsKey("minCount")) query.setFacetMinCount((Integer) facets.get("minCount"));
            if(facets.containsKey("maxCount")) query.setFacetLimit((Integer) facets.get("maxCount"));
            if(facets.containsKey("fields")) query.addFacetField(((ArrayList<String>) facets.get("fields")).toArray(String[]::new));

            if(facets.containsKey("offset")) query.setParam("facet.offset", String.valueOf(facets.get("offset")));
            if(facets.containsKey("contains")) query.setParam("facet.contains", (String) facets.get("contains"));
        }

        if (body.containsKey("facetsRange")) {
            DateFormat df = new SimpleDateFormat(timePattern);

            LinkedHashMap facetsRange = (LinkedHashMap) body.get("facetsRange");

            Date start = null;
            Date end = null;
            try {
                start = df.parse((String) facetsRange.get("rangeStart"));
                end = df.parse((String) facetsRange.get("rangeEnd"));
            } catch (ParseException e) {
                e.printStackTrace();
            }

            query.addDateRangeFacet((String) facetsRange.get("rangeField"), start, end, (String) facetsRange.get("rangeGap"));
        }


        if (body.containsKey("filters")) {
            ArrayList<HashMap> filters = (ArrayList<HashMap>) body.get("filters");
            for (HashMap filter : filters) {
                String key = (String) filter.get("key");
                String prefix = key;
                if ((boolean) filter.get("negated")) {
                    prefix = "-" + key;
                }
                List<String> values = (List<String>) filter.get("values");
                if (!values.isEmpty()) {
                    StringBuilder builder = new StringBuilder();
                    for (String s : values) {
                        builder.append(prefix + ":" + s + " OR ");
                    }
                    query.addFilterQuery(builder.substring(0, builder.length() - 4));
                }
            }

        }

        if (body.containsKey("markedIds")) {
            ArrayList<String> markedIds = (ArrayList<String>) body.get("markedIds");

            if (!markedIds.isEmpty()) {
                StringBuilder builder = new StringBuilder();
                for (String s : markedIds) {
                    builder.append("id: " + s + " OR ");
                }
                query.addFilterQuery(builder.substring(0, builder.length() - 4));
            }
        }

        if (body.containsKey("sort")) {

            ArrayList<HashMap> sorts = (ArrayList<HashMap>) body.get("sort");
            for (HashMap jo : sorts) {
                query.addSort((String) jo.get("field"), SolrQuery.ORDER.valueOf(((String) jo.get("direction")).toLowerCase()));
            }
        }

        Integer numRows = (Integer) body.getOrDefault("numRows", 0);
        query.setRows(numRows);


        QueryResponse response = null;
        try {
            response = solrClient.query(collection, query);
        } catch (SolrServerException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        SolrDocumentList documents = response.getResults();
        System.out.println("Response " + response.toString());
        System.out.println("Found " + documents.getNumFound() + " documents" + ", RETURNED " + documents.size() + " documents!");
        System.out.println(query.toQueryString());

        JSONObject result = new JSONObject();
        result.put("totalResponseCount", documents.getNumFound());
        result.put("docs", documents.stream().map((x) -> {
            JSONObject json =  new JSONObject(x);
            json.put("time", new SimpleDateFormat(timePattern).format(x.get("time")));
            return json;
        }).toArray());

        List<FacetField> facetFields = response.getFacetFields();
        List<RangeFacet> facetRanges = response.getFacetRanges();

        if (facetFields != null && !facetFields.isEmpty()){
            result.put("facets", convertAllFacets(response.getFacetFields()));
        }
        if (facetRanges != null && !facetRanges.isEmpty()){
            result.put("facetRanges",  convertRangeFacet(response.getFacetRanges().get(0)));
        }

        return result.toString();
    }

    private JSONArray convertAllFacets(List<FacetField> facets) {
        JSONArray allFacets = new JSONArray();

        for(FacetField facet: facets) {
            JSONObject json = new JSONObject();
            json.put("name", facet.getName());

            List<JSONObject> elements = new ArrayList<>();
            for (FacetField.Count fc : facet.getValues()) {
                JSONObject internal = new JSONObject();
                internal.put("value", fc.getName());
                internal.put("count", fc.getCount());
                elements.add(internal);
            }

            json.put("elements", elements);
            allFacets.put(json);
        }

        return allFacets;
    }

    private JSONObject convertRangeFacet(RangeFacet facet) {
        JSONObject json = new JSONObject();
        json.put("name", facet.getName());

        List<JSONObject> elements = new ArrayList<>();
        for (Object fc : facet.getCounts()) {
            JSONObject internal = new JSONObject();
            internal.put("value", ((RangeFacet.Count) fc).getValue());
            internal.put("count", ((RangeFacet.Count) fc).getCount());
            elements.add(internal);
        }

        json.put("elements", elements);
        return json;
    }

    public String[] getSchemaFields(String collection) {
        SchemaRequest request = new SchemaRequest();
        try {
            SchemaResponse response = request.process(solrClient, collection);
            String[] result = response.getSchemaRepresentation().getFields().stream().map(x -> x.get("name")).toArray(String[]::new);
            System.out.println(Arrays.toString(result));
            return result;
        } catch (SolrServerException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    @Override
    public String addDocument(String collection, Map<String, Object> body) {
        SolrInputDocument doc = new SolrInputDocument();
        for(String key: body.keySet()) {
            doc.addField(key, body.get(key));
        }

        try {
            solrClient.add(collection, doc, 1);
            return "{\"status\": 0}";
        } catch (SolrServerException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        // HTTP 500 error schmeißen
        // {status: 500, message: Internal Error}
        return "";
    }

    @Override
    public String deleteDocument(String collection, String id) {
        try {
            solrClient.deleteById(collection, id, 1);
            return "{\"status\": 0}";
        } catch (SolrServerException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }

    @Override
    public void checkAndCreateCollections() {
        // todo check before creation
        /*
        createCollection("logging", "_default", 1, 1);
        createCollection("logcomments", "_default", 1, 1);
        createCollection("usersettings", "_default", 1, 1);
        createCollection("triggercollection", "_default", 1, 1);

        addSchemaFields();

         */
    }

    public void createCollection(String collectionName, String configSchema, int numberOfShards, int numberOfReplicas){
        try {
            CollectionAdminRequest.Create creator = CollectionAdminRequest.createCollection(collectionName, configSchema, numberOfShards, numberOfReplicas);
            creator.setMaxShardsPerNode(1);
            creator.process(solrClient);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public void addSchemaFields(){
        addSchemaField("application", "string", "logging");
        addSchemaField("component", "string", "logging");
        addSchemaField("hostName", "string", "logging");
        addSchemaField("level", "string", "logging");
        addSchemaField("logFileName", "string", "logging");
        addSchemaField("message", "string", "logging");
        addSchemaField("fullMessage", "string", "logging");
        addSchemaField("threadId", "string", "logging");
        addSchemaField("threadName", "string", "logging");
        addSchemaField("timestamp", "string", "logging");
        addSchemaField("logger", "string", "logging");
        addSchemaField("time", "pdate", "logging");
    }

    public void addSchemaField(String name, String type, String schema){
        try {
            String urlString = "http://localhost:8983/solr/"+schema;
            SolrClient solr = new HttpSolrClient.Builder(urlString).build();

            Map<String, Object> fieldAttributes = new LinkedHashMap<>();
            fieldAttributes.put("name", name);
            fieldAttributes.put("type", type);
            fieldAttributes.put("stored", true);

            SchemaRequest.AddField addFieldUpdateSchemaRequest =
                    new SchemaRequest.AddField(fieldAttributes);
            SchemaResponse.UpdateResponse addFieldResponse = addFieldUpdateSchemaRequest.process(solr);
        } catch (Exception e){
            e.printStackTrace();
        }
    }
}
