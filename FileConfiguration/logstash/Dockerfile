FROM docker.elastic.co/logstash/logstash:7.17.13

RUN rm -f /usr/share/logstash/pipeline/logstash.conf && \
      bin/logstash-plugin install logstash-output-solr_http