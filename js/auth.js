// Solo para la demo: las cuentas se guardan en localStorage. Para producción, usar Supabase Auth.
const AC = 't2p_accounts', SE = 't2p_session';
const acc = () => JSON.parse(localStorage.getItem(AC) || '{}');
async function hash(p, salt) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + p)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('') }
const Auth = {
    async register(u, e, p, p2) {
        e = e.trim().toLowerCase(); u = u.trim();
        if (!/^[\w.-]{3,20}$/.test(u)) return 'El nombre de usuario debe tener entre 3 y 20 caracteres: letras, números, punto, guion o guion bajo.';
        if (!/^\S+@\S+\.\S+$/.test(e)) return 'El correo electrónico no es válido'; if (p.length < 8) return 'La contraseña debe tener al menos 8 caracteres'; if (p !== p2) return 'Las contraseñas no coinciden';
        const a = acc(); if (a[e]) return 'Ya existe una cuenta con ese correo electrónico'; const salt = crypto.randomUUID(); a[e] = { u, salt, h: await hash(p, salt) }; localStorage.setItem(AC, JSON.stringify(a)); localStorage.setItem(SE, e); return null
    },
    async login(e, p) { e = e.trim().toLowerCase(); const a = acc()[e]; if (!a || a.h !== await hash(p, a.salt)) return 'El correo electrónico o la contraseña son incorrectos'; localStorage.setItem(SE, e); return null },
    async recover(e) { return acc()[e.trim().toLowerCase()] ? 'Modo demo: no se envían correos. Para enviar enlaces reales de recuperación, se necesita Supabase Auth.' : 'No hay ninguna cuenta de demostración con ese correo electrónico.' },
    user() { const e = localStorage.getItem(SE); return e && acc()[e] ? { email: e, name: acc()[e].u } : null },
    logout() { localStorage.removeItem(SE) }
};
