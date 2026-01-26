import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth, RequireAdmin } from '../components/guards/ProtectedRoutes';
import { MainLayout } from '../components/layout/MainLayout';
import Home from '../pages/public/Home';
import { Login } from '../pages/public/Login';
import { Pets } from '../pages/public/Pets';
import { PetDetail } from '../pages/public/PetDetail';
import { AdoptPet } from '../pages/private/AdoptPet';
import { MyRequests } from '../pages/private/MyRequests';
import { Profile } from '../pages/private/Profile';
import { AdminRequests } from '../pages/admin/AdminRequests';
import { UsersList } from '../pages/admin/UsersList';
import { AdminPets } from '../pages/admin/AdminPets';
import { EditPet } from '../pages/admin/EditPet';
import { AddPet } from '../pages/admin/AddPets';
import { Register } from '../pages/public/Register';
import { Shelters } from '../pages/public/Shelters';
import { ShelterDetail } from '../pages/public/ShelterDetail';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* TODAS LAS RUTAS CON LAYOUT */}
        <Route element={<MainLayout />}>

          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* PÚBLICAS */}
          <Route path="/mascotas" element={<Pets />} />
          <Route path="/mascotas/:id" element={<PetDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/shelters" element={<Shelters />} />
          <Route path="/shelters/:id" element={<ShelterDetail />} />


          {/* PRIVADAS */}
          <Route element={<RequireAuth />}>
            <Route path="/mis-solicitudes" element={<MyRequests />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/adoptar/:petId" element={<AdoptPet />} />
          </Route>

          {/* ADMIN */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin/solicitudes" element={<AdminRequests />} />
            <Route path="/admin/usuarios" element={<UsersList />} />
            <Route path="/admin/mascotas" element={<AdminPets />} />
            <Route path="/admin/mascotas/nueva" element={<AddPet />} />
            <Route path="/admin/mascotas/editar/:id" element={<EditPet />} />
          </Route>

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};
