package de.adesso.logging.configs;

import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.RestClients;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;

@Configuration
@ComponentScan
@Profile("elastic")
public class ElasticConfig {
	
	
	@Value ("${elastic.timeout:60000}")
    private int timeout;

	@Value("${elastic.port}")
    private long port;

    @Value("${elastic.baseUrl}")
    private String elasticBaseUrl;

    @Value("${elastic.collection}")
    private String collection;

    @Bean
    public RestHighLevelClient elasticClient() {
        ClientConfiguration clientConfiguration = ClientConfiguration.builder()
        		.connectedTo(elasticBaseUrl+":"+port)
        		.withConnectTimeout(timeout)
        		.withSocketTimeout(timeout)
        		.build();
        RestHighLevelClient elasticClient = RestClients.create(clientConfiguration).rest();
        return elasticClient;
    }

    @Bean
    public ElasticsearchOperations elasticsearchTemplate() throws Exception {
        return new ElasticsearchRestTemplate(elasticClient());
    }
}
