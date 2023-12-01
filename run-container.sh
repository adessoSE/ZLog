docker run -d -p 8090:8090 -e "elastic.baseUrl=elastic-master" -e "elastic.port=9200" --name zlog de.adesso.logging/zlog-docker:0.0.1-SNAPSHOT
