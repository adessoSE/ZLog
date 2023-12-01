package de.adesso.logging.connectors;

import java.util.Map;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

public interface SearchConnector {

    public String getConnectorName();
    public String getDocument(String collection, String id);
    public String getFilteredDocuments(String collection, Map<String, Object> body);
    public String[] getSchemaFields(String collection);

    public String addDocument(String collection, Map<String, Object> body);
    public String deleteDocument(String collection, String id);

    @EventListener(ApplicationReadyEvent.class)
    public void checkAndCreateCollections();

}
