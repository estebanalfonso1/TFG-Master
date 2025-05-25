package tfgMaster.controller;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import tfgMaster.entity.Valoracion;
import tfgMaster.service.ValoracionService;

@RestController
@RequestMapping("/valoracion")
@Tag(name = "Valoracion", description = "Operaciones relacionadas con la gestión de las valoraciones")
public class ValoracionController {
    @Autowired
    private ValoracionService valoracionService;

    @PostMapping
    @Operation(summary = "Crear una nueva valoracion")
    @ApiResponses(value = { @ApiResponse(responseCode = "201", description = "Valoracion creada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Error al crear la valoracion") })
    public void saveValoracion(@RequestBody Valoracion valoracion) {
        Valoracion valoracionSave = valoracionService.saveValoracion(valoracion);
        if (valoracionSave == null) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al crear la valoracion");
        } else {
            ResponseEntity.status(HttpStatus.ACCEPTED).body("Valoracion creada correctamente");
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una valoracion existente")
    @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Valoracion actualizada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Valoracion no encontrada"),
            @ApiResponse(responseCode = "400", description = "Valoracion inválida, e\"Valoracion no encontrada o no es creada por el profesor logueado") })
    public void updateValoracion(@PathVariable int id, @RequestBody Valoracion updatedValoracion) {
        Valoracion response = valoracionService.updateValoracion(id, updatedValoracion);
        if (response != null) {
            ResponseEntity.status(HttpStatus.OK).body("Valoracion actualizada exitosamente");
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("Valoracion no encontrada");
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una valoracion por ID")
    @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Valoracion eliminada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Valoracion no encontrada o no es creada por el profesor logueado") })
    public void deleteValoracion(@PathVariable int id) {
        if (valoracionService.deleteValoracion(id)) {
            ResponseEntity.status(HttpStatus.OK).body("Valoracion eliminada exitosamente");
        } else {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Valoracion no encontrada o no es creada por el profesor logueado");
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar una valoracion por ID")
    @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Valoracion encontrada"),
            @ApiResponse(responseCode = "404", description = "Valoracion no encontrada") })
    public ResponseEntity<Valoracion> findOneValoracion(@PathVariable int id) {
        Optional<Valoracion> valoracion = valoracionService.getValoracionById(id);
        if (!valoracion.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            return ResponseEntity.ok(valoracion.get());
        }
    }

    @GetMapping("/deTribunal/{id}")
	@Operation(summary = "Obtener todas las valoraciones de un tribunal")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Lista de valoraciones obtenida exitosamente"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor") })
	public ResponseEntity<Set<Valoracion>> getAllValoracionesByTribunal(@PathVariable int id) {
		Set<Valoracion> listValoracions = valoracionService.getValoracionByTribunal(id);
		return ResponseEntity.ok(listValoracions);
	}

    @GetMapping
    @Operation(summary = "Obtener todas las valoraciones")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de valoraciones obtenida exitosamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor") })
    public ResponseEntity<List<Valoracion>> getAllValoraciones() {
        List<Valoracion> listValoraciones = valoracionService.getAllValoraciones();
        return ResponseEntity.ok(listValoraciones);
    }

    @GetMapping("/calificacion/{id}")
    @Operation(summary = "Cargar la calificación del alumno de un tribunal por ID")
    @ApiResponses(value = { @ApiResponse(responseCode = "202", description = "Calificación cargada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Error al cargar la calificación") })
    public ResponseEntity<Void> cargarCalificacion(@PathVariable int id) {
        Boolean res = valoracionService.cargarCalificacion(id);
        if (res == false) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } else {
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        }
    }
}
