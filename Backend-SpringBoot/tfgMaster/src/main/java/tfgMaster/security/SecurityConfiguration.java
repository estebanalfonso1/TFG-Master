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
				.requestMatchers(HttpMethod.PUT, "/administrador").hasAuthority("ADMINISTRADOR")

				// PROFESOR
				.requestMatchers(HttpMethod.POST, "/profesor").hasAuthority("ADMINISTRADOR")
				.requestMatchers(HttpMethod.PUT, "/profesor").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.DELETE, "/profesor/{id}").hasAuthority("ADMINISTRADOR")
				.requestMatchers(HttpMethod.GET, "/profesor").hasAnyAuthority("PROFESOR", "ADMINISTRADOR")
				.requestMatchers(HttpMethod.GET, "/profesor/{id}").hasAuthority("ADMINISTRADOR")

				// ALUMNO
				.requestMatchers(HttpMethod.POST, "/alumno").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.PUT, "/alumno").hasAuthority("ALUMNO")
				.requestMatchers(HttpMethod.PUT, "/alumno/{id}").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.DELETE, "/alumno/{id}").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.GET, "/alumno/{id}").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.GET, "/alumno").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.GET, "/alumno/deProfesor").hasAuthority("PROFESOR")

				// TRIBUNAL
				.requestMatchers(HttpMethod.POST, "/tribunal").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.PUT, "/tribunal/{id}").hasAuthority("ALUMNO")
				.requestMatchers(HttpMethod.DELETE, "/tribunal/{id}").hasAnyAuthority("ADMINISTRADOR", "PROFESOR")
				.requestMatchers(HttpMethod.GET, "/tribunal/{id}").hasAnyAuthority("PROFESOR", "ALUMNO")
				.requestMatchers(HttpMethod.GET, "/tribunal").hasAuthority("ADMINISTRADOR")
				.requestMatchers(HttpMethod.GET, "/tribunal/deProfesor").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.GET, "/tribunal/profesores/{id}").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.GET, "/tribunal/calificar/{id}").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.GET, "/tribunal/deAlumno").hasAuthority("ALUMNO")

				// RUBRICA
				.requestMatchers(HttpMethod.POST, "/rubrica").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.PUT, "/rubrica/{id}").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.DELETE, "/rubrica/{id}").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.GET, "/rubrica/{id}").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.GET, "/rubrica").hasAuthority("PROFESOR")

				// CRITERIO
				.requestMatchers(HttpMethod.POST, "/criterio").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.PUT, "/criterio/{id}").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.DELETE, "/criterio/{id}").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.GET, "/criterio/{id}").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.GET, "/criterio").hasAuthority("PROFESOR")

				// VALORACION
				.requestMatchers(HttpMethod.POST, "/valoracion").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.PUT, "/valoracion/{id}").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.DELETE, "/valoracion/{id}").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.GET, "/valoracion/{id}").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.GET, "/valoracion").hasAuthority("PROFESOR")
				.requestMatchers(HttpMethod.GET, "/valoracion/deTribunal/{id}").hasAuthority("ALUMNO")
				.requestMatchers(HttpMethod.GET, "/tribunal/calificacion/{id}").hasAuthority("PROFESOR")

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
        config.setAllowedOrigins(List.of("https://frontend-angular-kohl.vercel.app"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
		config.setAllowCredentials(true);
		source.registerCorsConfiguration("/**", config);
		return new CorsFilter(source);
	}

}
