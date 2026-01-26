import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth, RequireAdmin } from '../components/guards/ProtectedRoutes';
import { MainLayout } from '../components/layout/MainLayout';
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

const Placeholder = ({ title }: { title: string }) => <h1 className="text-2xl font-bold">{title}</h1>;

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          
          {/* =======================
              RUTAS PÚBLICAS
          ======================= */}
          <Route path="/" element={<Placeholder title="Inicio - Puppy Family" />} />
          <Route path="/mascotas" element={<Pets />} />
          <Route path="/mascotas/:id" element={<PetDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/shelters" element={<Shelters />} />
          <Route path="/shelters/:id" element={<ShelterDetail />} />


          {/* =======================
              RUTAS PRIVADAS
          ======================= */}
          <Route element={<RequireAuth />}>
            <Route path="/mis-solicitudes" element={<MyRequests />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/adoptar/:petId" element={<AdoptPet />} />
          </Route>

          {/* =======================
              RUTAS DE ADMIN
          ======================= */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin/solicitudes" element={<AdminRequests />} />
            <Route path="/admin/usuarios" element={<UsersList />} />
            <Route path="/admin/mascotas" element={<AdminPets />} />
            <Route path="/admin/mascotas/nueva" element={<AddPet />} />
            <Route path="/admin/mascotas/editar/:id" element={<EditPet />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};