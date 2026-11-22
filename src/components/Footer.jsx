function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 py-6 w-full mt-auto">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-slate-500 text-center sm:text-left">
                    &copy; {new Date().getFullYear()} CondoNotify - DUOC UC. Todos los derechos reservados.
                </p>
                
                <div className="flex gap-6 text-sm font-medium text-slate-400">
                    <a href="#" className="hover:text-blue-400 transition-colors">Términos</a>
                    <a href="#" className="hover:text-blue-400 transition-colors">Privacidad</a>
                    <a href="#" className="hover:text-blue-400 transition-colors">Contacto</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;