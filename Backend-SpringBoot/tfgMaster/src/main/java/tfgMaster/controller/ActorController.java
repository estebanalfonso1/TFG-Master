package tfgMaster.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import tfgMaster.entity.Actor;
import tfgMaster.entity.ActorLogin;
import tfgMaster.security.JWTUtils;
import tfgMaster.service.ActorService;

@RestController
public class ActorController {
	@Autowired
    private AuthenticationManager authenticationManager;

	@Autowired
    private JWTUtils JWTUtils;

    @Autowired
    private ActorService actorService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody ActorLogin actorLogin) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(actorLogin.getUsername(), actorLogin.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = JWTUtils.generateToken(authentication);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

	@GetMapping("/userLogin") 
	public ResponseEntity<Actor> login() {
		Actor a = JWTUtils.userLogin();
		if (a == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		return ResponseEntity.ok(a);
	}

    @GetMapping("/actorExiste/{username}")
    public ResponseEntity<Boolean> checkUserExists(@PathVariable String username) {
        boolean exists = actorService.findByUsername(username).isPresent();
        return ResponseEntity.ok(exists);
    }
}
