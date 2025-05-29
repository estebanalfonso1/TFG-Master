package tfgMaster.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import tfgMaster.entity.Administrador;
import tfgMaster.entity.Alumno;
import tfgMaster.entity.Profesor;
import tfgMaster.entity.Tribunal;
import tfgMaster.entity.Valoracion;
import tfgMaster.repository.ValoracionRepository;
import tfgMaster.security.JWTUtils;

@Service
public class ValoracionService {
    @Autowired
    private ValoracionRepository valoracionRepository;

    @Autowired
    @Lazy
    private AlumnoService alumnoService;

    @Autowired
    private JWTUtils JWTUtils;

    // Busca todas las VALORACIONES
    public List<Valoracion> getAllValoraciones() {
        return valoracionRepository.findAll();
    }

    // Busca una VALORACION
    public Optional<Valoracion> getValoracionById(int id) {
        return valoracionRepository.findById(id);
    }

    // Busca VALORACIONES por TRIBUNAL
    public Set<Valoracion> getValoracionByTribunal(int idTribunal) {

        Set<Valoracion> valoraciones = new HashSet<Valoracion>();

        for (Valoracion valoracion : getAllValoraciones()) {
            if (valoracion.getTribunal().getId() == idTribunal) {
                valoraciones.add(valoracion);
            }
        }

        return valoraciones;
    }

    // Crear VALORACION
    @Transactional
    public Valoracion saveValoracion(Valoracion valoracion) {
        return valoracionRepository.save(valoracion);
    }

    // Actualizar VALORACION
    @Transactional
    public Valoracion updateValoracion(int id, Valoracion valoracion) {
        Optional<Valoracion> valoracionO = valoracionRepository.findById(id);

        if (valoracionO.isPresent()) {
            Profesor profesor = JWTUtils.userLogin();
            if (profesor != null && profesor.getId() == valoracionO.get().getProfesor().getId()) {
                valoracionO.get().setValoracion(valoracion.getValoracion());
                return valoracionRepository.save(valoracionO.get());
            }
        }

        return null;
    }

    // Eliminar VALORACION
    @Transactional
    public boolean deleteValoracion(int id) {
        Optional<Valoracion> valoracionO = valoracionRepository.findById(id);
        Object object = JWTUtils.userLogin();
        boolean res = false;

        if (valoracionO.isPresent()) {
            boolean tribunalCalificado = false;
            if (valoracionO.get().getTribunal().getEstado() == "CALIFICADO") {
                tribunalCalificado = true;
            }

            if (object instanceof Profesor && !tribunalCalificado) {
                valoracionRepository.deleteById(id);

                res = true;
            } else if (object instanceof Administrador) {
                valoracionRepository.deleteById(id);
                res = true;
            }
        }
        return res;
    }

    public boolean cargarCalificacion(int idTribunal) {
        boolean tribunalExiste = false;
        Alumno alumno = new Alumno();
        Tribunal tribunal = new Tribunal();

        for (Valoracion valoracion : getAllValoraciones()) {
            if (valoracion.getTribunal().getId() == idTribunal) {
                tribunalExiste = true;
                alumno = valoracion.getTribunal().getAlumno();
                tribunal = valoracion.getTribunal();
            }
        }

        ArrayList<Double> valoracionesObtenidas = new ArrayList<>();
        double sumaNotas = 0;

        boolean res = false;

        if (tribunalExiste) {
            for (Valoracion valoracion : getAllValoraciones()) {
                if (valoracion.getTribunal().equals(tribunal)) {
                    valoracionesObtenidas.add(valoracion.getValoracion());
                    sumaNotas += valoracion.getCriterio().getValoracionMaxima();
                }
            }

            double mediaObtenida = 0;

            for (int i = 0; i < valoracionesObtenidas.size(); i++) {
                mediaObtenida += valoracionesObtenidas.get(i);
            }

            double notaFinal = (mediaObtenida * 10) / sumaNotas;
            System.out.print(sumaNotas);
            alumno.setCalificacionTotal(notaFinal);
            alumnoService.updateAlumnoById(alumno.getId(), alumno);

            res = true;
        }

        return res;
    }
}
