package de.adesso.logging;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({"de.adesso.logging"})
public class LoggingWebserverApplication {

	public static void main(String[] args) {
		SpringApplication.run(LoggingWebserverApplication.class, args);
	}
}
