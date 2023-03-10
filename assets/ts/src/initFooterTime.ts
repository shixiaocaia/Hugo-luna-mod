export default function() {
    const el = document.getElementById('run-time');
    if (!el) return false;
    const runTimer = setInterval(() => {
        if (document.querySelector('.goog-te-banner-frame')) {
            el.remove();
            clearInterval(runTimer);
            return false;
        };
        const startDate = new Date(window.__theme.creatTime);
        const time = new Date();
        const diff = time.getTime() - startDate.getTime();
    
        const day = diff / (1000*60*60*24);
        const hour = 24 * parseFloat('0.' + day.toString().replace(/\d+\.(\d*)/, '$1'));
        const minute = 60 * parseFloat('0.' + hour.toString().replace(/\d+\.(\d*)/, '$1'));
        const second = 60 * parseFloat('0.' + minute.toString().replace(/\d+\.(\d*)/, '$1'));

        const dayEL = document.getElementById('run-time-d') as HTMLElement;
        dayEL.innerText = (~~(day)).toString();
    }, 1000);
}