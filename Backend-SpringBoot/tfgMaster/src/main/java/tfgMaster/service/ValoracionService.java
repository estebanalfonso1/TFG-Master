package tfgMaster.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import tfgMaster.entity.Profesor;
import tfgMaster.entity.Valoracion;
import tfgMaster.repository.ValoracionRepository;
import tfgMaster.security.JWTUtils;

@Service
public class ValoracionService {
    @Autowired
    private ValoracionRepository valoracionRepository;

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
            if (profesor != null) {
                valoracionO.get().setProfesor(valoracion.getProfesor());
                valoracionO.get().setTribunal(valoracion.getTribunal());
                valoracionO.get().setCriterio(valoracion.getCriterio());
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
        Profesor profesor = JWTUtils.userLogin();
        boolean res = false;

        if (valoracionO.isPresent()) {
            boolean tribunalCalificado = false;
            if (valoracionO.get().getTribunal().getEstado() == "CALIFICADO") {
                tribunalCalificado = true;
            }

            if (profesor != null && !tribunalCalificado && valoracionO.get().getProfesor().equals(profesor)) {
                valoracionRepository.deleteById(id);

                res = true;
            }
        }
        return res;
    }
}
