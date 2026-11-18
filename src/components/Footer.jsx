function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6 mt-auto transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    &copy; {new Date().getFullYear()} CondoNotify - DUOC UC. Todos los derechos reservados.
                </p>
                <div className="flex gap-4 text-sm text-slate-400 dark:text-slate-500">
                    <span>Términos</span>
                    <span>Privacidad</span>
                    <span>Contacto</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;