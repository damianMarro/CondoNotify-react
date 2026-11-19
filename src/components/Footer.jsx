function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    &copy; {new Date().getFullYear()} CondoNotify - DUOC UC. Todos los derechos reservados.
                </p>
                <div className="flex gap-6 text-sm font-medium text-slate-400 dark:text-slate-500">
                    <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Términos</a>
                    <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacidad</a>
                    <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contacto</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;