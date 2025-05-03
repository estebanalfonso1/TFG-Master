package tfgMaster.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import tfgMaster.security.JWTAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
	@Autowired
	private JWTAuthenticationFilter JWTAuthenticationFilter;

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.cors().and()
				.csrf().disable()
				.authorizeHttpRequests()
				// LOGIN
				.requestMatchers("/login").permitAll()
				.requestMatchers("/userLogin").permitAll()
				.requestMatchers("/actorExiste/**").permitAll()

				// ADMINISTRADOR
				.requestMatchers(HttpMethod.POST, "/administrador").hasAuthority("ADMINISTRADOR")
				.requestMatchers(HttpMethod.PUT, "/administrador").hasAuthority("ADMINISTRADOR")
				.requestMatchers(HttpMethod.DELETE, "/administrador").hasAuthority("ADMINISTRADOR")

				// PROFESOR
				.requestMatchers(HttpMethod.POST, "/profesor").hasAuthority("ADMINISTRADOR")
				.requestMatchers(HttpMethod.PUT, "/profesor").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.DELETE, "/profesor").hasAuthority("ADMINISTRADOR")

				// ALUMNO
				.requestMatchers(HttpMethod.POST, "/alumno").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.PUT, "/alumno").hasAuthority("ALUMNO")
				.requestMatchers(HttpMethod.PUT, "/alumno/{id}").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.DELETE, "/alumno").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.GET, "/alumno/{id}").hasAuthority("PROFESOR")

				// SWAGGER
				.requestMatchers("/swagger-ui/**").permitAll()
				.requestMatchers("/v3/api-docs/**").permitAll()

				// OTRAS RUTAS
				.anyRequest().authenticated();

		http.addFilterBefore(JWTAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(List.of("http://localhost:4200"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
		config.setAllowCredentials(true);
		source.registerCorsConfiguration("/**", config);
		return new CorsFilter(source);
	}

}
