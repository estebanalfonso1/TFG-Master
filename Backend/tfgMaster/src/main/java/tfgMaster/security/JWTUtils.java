package tfgMaster.security;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;
import tfgMaster.entity.Actor;
import tfgMaster.entity.Administrador;
import tfgMaster.entity.Alumno;
import tfgMaster.entity.Profesor;
import tfgMaster.service.ActorService;
import tfgMaster.service.AdministradorService;
import tfgMaster.service.AlumnoService;
import tfgMaster.service.ProfesorService;

@Component
public class JWTUtils {
	private static final String JWT_FIRMA = "tfgMaster";
	private static final long EXTENCION_TOKEN = 86400000;
	
	@Autowired
	@Lazy
	private ActorService actorService;

	@Autowired
	@Lazy
	private AdministradorService administradorService;

	@Autowired
	@Lazy
	private AlumnoService alumnoService;

	@Autowired
	@Lazy
	private ProfesorService profesorService;

	public static String getToken(HttpServletRequest request) {
		String tokenBearer = request.getHeader("Authorization");
		if (StringUtils.hasText(tokenBearer) && tokenBearer.startsWith("Bearer ")) {
			return tokenBearer.substring(7);
		}
		return null;
	}

	public static boolean validateToken(String token) {
		try {
			Jwts.parser().setSigningKey(JWT_FIRMA).parseClaimsJws(token);
			return true;
		} catch (Exception e) {
			throw new AuthenticationCredentialsNotFoundException("JWT ha experido o no es valido");
		}
	}

	public static String getUsernameOfToken(String token) {
		return Jwts.parser().setSigningKey(JWT_FIRMA).parseClaimsJws(token).getBody().getSubject();
	}

	public static String generateToken(Authentication authentication) {
		String username = authentication.getName();
		Date fechaActual = new Date();
		Date fechaExpiracion = new Date(fechaActual.getTime() + EXTENCION_TOKEN);
		String rol = authentication.getAuthorities().iterator().next().getAuthority();

		String token = Jwts.builder()
				.setSubject(username)
				.claim("rol", rol)
				.setIssuedAt(fechaActual)
				.setExpiration(fechaExpiracion)
				.signWith(SignatureAlgorithm.HS512, JWT_FIRMA)
				.compact();
		return token;
	}

	public <T> T userLogin() {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		T res = null;

		if (StringUtils.hasText(username)) {
			Optional<Actor> actorO = actorService.findByUsername(username);
			if (actorO.isPresent()) {
				Actor actor = actorO.get();
				switch (actor.getRol()) {
				case ADMINISTRADOR:
					Optional<Administrador> administradorOptional = administradorService.findByUsername(username);
					if (administradorOptional.isPresent()) {
						res = (T) administradorOptional.get();
					}
					break;
				case ALUMNO:
					Optional<Alumno> alumnoOptional = alumnoService.findByUsername(username);
					if (alumnoOptional.isPresent()) {
						res = (T) alumnoOptional.get();
					}
					break;
				case PROFESOR:
					Optional<Profesor> profesorOptional = profesorService.findByUsername(username);
					if (profesorOptional.isPresent()) {
						res = (T) profesorOptional.get();
					}
					break;

				
				}
			}
		}
		return res;
	}
}
