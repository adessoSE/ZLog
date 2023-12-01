package de.adesso.logging.controllers;

import de.adesso.logging.connectors.SearchConnector;
import org.apache.solr.client.solrj.SolrServerException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;


@RestController
@RequestMapping("/data")
@CrossOrigin
public class LoggingController {


    @Autowired
    private SearchConnector searchConnector;

    @GetMapping("/{collection}/{id}")
    public String getDocument(@PathVariable String collection, @PathVariable String id) throws IOException, SolrServerException {
        return searchConnector.getDocument(collection, id);
    }

    /**
     * POST /<collection>/
     * {
     *   searchText: ‘searchText’, // search text value
     *   start: startOffset, // offset for all docs
     *   time: [start, end], // start time and end time needed for filtering
     *   facets: { facetOn: true/false, fields: [level, class], minCount: x1, maxCount: x2, offset: x3, contains: s1}, // facet enable and fields, offset needed for 'paging'
     *   facetsRange: {rangeField: ‘time’, rangeStart: start, rangeEnd: end, rangeGap: gap}, // special facetted field with gaps
     *   filters: [{level: [INFO, DEBUG], negated: true/false}, {key2: [value1, value2], negated: true/false}], // filters with values and negated on/off for all value of the same key
     *   markedIds: [id1, id2], // array of document ids to be fetched
     *   sort: [{field: time, direction:asc/Desc}, {field: count, direction:asc/Desc}], // sort by multiple keys and a certain direction
     *   numRows: n1 // number of rows/documents
     * }
     *
     * Response:
     * {
     *   docs: [{level: INFO, class: Logger}, {key1: value1, key2: value2}], // list of result documents
     *   facets: [{name: level, elements: [{value:INFO, count:6}, {value:DEBUG, count:12}]}],
     *   facetRanges: {field: time, values: [v1, v2, v3, v4], counts: [c1, c2, c3, c4]}, // das gleiche wie oben
     *   totalResponseCount: n1
     * }
     * **/
    @PostMapping("/{collection}")
    public String getFilteredDocuments(@PathVariable String collection, @RequestBody Map<String, Object> body) {
        return searchConnector.getFilteredDocuments(collection, body);
    }

    @GetMapping("/test")
    public String getTriggers() {
        return ("Trying to get!" + " [Working with: " + searchConnector.getConnectorName() + "]");
    }

    @GetMapping("/{collection}/fields")
    public String[] getSchemaFields(@PathVariable String collection) {
        return searchConnector.getSchemaFields(collection);
    }

    @PutMapping("/{collection}")
    public String addDocumentToCollection(@PathVariable String collection, @RequestBody Map<String, Object> body) {
        return searchConnector.addDocument(collection, body);
    }

    @DeleteMapping("/{collection}/{id}")
    public String deleteDocument(@PathVariable String collection, @PathVariable String id) {
        return searchConnector.deleteDocument(collection, id);
    }
}
