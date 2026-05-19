import { Routes } from '@angular/router';
import { Login } from './login/login';
import { DashboardAdmin } from './Dashboard-Admin/home';
import { LayoutAdmin } from './layout-admin/layout-admin';
import { DiemDanhAdmin } from './diem-danh-admin/diem-danh-admin';
import { DiemDanhUser } from './diem-danh-user/diem-danh-user';
import { Tts } from './tts/tts';
import { TtsAdmin } from './tts-admin/tts-admin';
import { Account } from './account/account';
import { TaskAdmin } from './task-admin/task-admin';
import { LayoutUser } from './layout-user/layout-user';
import { DashboardUser } from './Dashboard-User/home';
import { TaskUser } from './task-user/task-user';
import { adminGuard } from './guards/guards';
export const routes: Routes = [
    { path: 'login', component: Login },
    
    {
        path: '',
        component: LayoutAdmin,
        canActivate: [adminGuard],
        children: 
        [
            { path: '', redirectTo: 'dashboard-admin', pathMatch: 'full' },
            { path: 'dashboard-admin', component: DashboardAdmin },
            { path: 'diem-danh-admin', component: DiemDanhAdmin },
            { path: 'tts-admin', component: TtsAdmin },
            {path: 'account', component: Account},
            {path: 'task-admin', component: TaskAdmin}
            
        ]
    },
    {
        path: '',
        component: LayoutUser,
        children: [
            
            { path: '', redirectTo: 'dashboard-user', pathMatch: 'full' },
            { path: 'dashboard-user', component: DashboardUser },
            { path: 'tts', component: Tts},
            { path: 'diem-danh-user', component: DiemDanhUser },
            { path: 'task-user', component: TaskUser}
        ]
    }
];
