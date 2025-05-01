package tfgMaster;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import tfgMaster.service.AdministradorService;

@SpringBootApplication
public class TfgMasterApplication implements CommandLineRunner {

	@Autowired
	private AdministradorService administradorService;

	public static void main(String[] args) {
		SpringApplication.run(TfgMasterApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// Invocar el método para crear el administrador por defecto si no existe
		administradorService.administradorPorDefecto();
	}

}
