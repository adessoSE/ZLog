package de.adesso.logging.configs;

import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@ComponentScan
@Profile("solr")
public class SolrConfig {

    @Value("${solr.port}")
    private long port;

    @Value("${solr.baseUrl}")
    private String solrBaseUrl;

    @Bean
    public SolrClient solrClient() {
        String solrUrl = solrBaseUrl + ":" + port + "/solr";
        SolrClient solrClient = new HttpSolrClient.Builder(solrUrl).build();
        return solrClient;
    }
}
