// js/main.js
(function () {
    // On ne lance le code que si on est sur une page avec la liste d'ingrédients
    const list = document.getElementById('ingredients');
    if (!list) return;

    const baseServings = parseInt(list.dataset.baseServings || '4', 10);
    const select =
        document.getElementById('servings-select') ||
        document.querySelector('.servings select');
    const announcer = document.getElementById('servings-announcer');

    if (!select) return;

    function formatQuantity(value, unit) {
        switch (unit) {
            case 'g':
                return Math.round(value);
            case 'œuf':
            case 'jaune':
            case 'pincée':
            case 'tour':
                return Math.max(1, Math.round(value));
            default:
                return Math.round(value * 10) / 10;
        }
    }

    function unitLabel(qty, unit) {
        const isPlural = qty > 1;
        const map = {
            g: 'g',
            œuf: isPlural ? 'œufs' : 'œuf',
            jaune: isPlural ? 'jaunes d’œuf' : 'jaune d’œuf',
            pincée: isPlural ? 'pincées' : 'pincée',
            tour: isPlural ? 'tours' : 'tour',
        };
        return map[unit] || unit + (isPlural ? 's' : '');
    }

    function parseServingsLabel(label) {
        const m = String(label).match(/\d+/);
        return m ? parseInt(m[0], 10) : baseServings;
    }

    function updateAll() {
        const targetServings = parseServingsLabel(select.value);
        const factor = targetServings / baseServings;

        list.querySelectorAll('li').forEach((li) => {
            const base = parseFloat(li.dataset.base);
            const unit = li.dataset.unit || '';
            const qtyEl = li.querySelector('.qty');
            const unitEl = li.querySelector('.unit');
            if (!qtyEl || Number.isNaN(base)) return;

            const newQty = formatQuantity(base * factor, unit);
            qtyEl.textContent = newQty;

            // met à jour l’unité (singulier/pluriel) sans casser l’espace
            if (unitEl) unitEl.textContent = ' ' + unitLabel(newQty, unit);
        });

        if (announcer) {
            announcer.textContent = `Quantités mises à jour pour ${targetServings} personnes.`;
        }
    }

    // --- Contact form demo (optional) ---
    (function(){
        const form = document.querySelector('.contact-form');
        if(!form) return;
        const status = document.getElementById('form-status');

        form.addEventListener('submit', (e)=>{
            e.preventDefault();
            // mini “validation”
            const name = form.querySelector('#name');
            const email = form.querySelector('#email');
            const service = form.querySelector('#service');
            const message = form.querySelector('#message');

            if(!name.value || !email.value || !service.value || !message.value){
                status.textContent = 'Merci de remplir les champs requis.';
                status.style.color = '#b42318';
                return;
            }

            // démo : succès visuel
            status.textContent = 'Message envoyé (démo) — merci !';
            status.style.color = 'green';
            form.reset();
        });
    })();

    // init + écouteur
    updateAll();
    select.addEventListener('change', updateAll);
})();


