const facts = [
        "📜 Согласно архивным записям, призрак Анны Иоанновны чаще всего появляется 17 октября - в годовщину её смерти.",
        "📜 Летний сад был основан Петром I в 1704 году и считается одним из старейших парков Петербурга.",
        "📜 Охранники Летнего сада до сих пор рассказывают о странных явлениях в предрассветные часы.",
        "📜 Анна Иоанновна правила Россией с 1730 по 1740 год.",
        "📜 Летний дворец, где произошло событие, не сохранился до наших дней."
    ];
    
    let factIndex = 0;
    
    function toggleFact() {
        const factDiv = document.getElementById('fact');
        factDiv.classList.toggle('show');
    }
    
    function generateNewFact() {
        factIndex = (factIndex + 1) % facts.length;
        const factDiv = document.getElementById('fact');
        factDiv.innerHTML = facts[factIndex];
        factDiv.classList.add('show');
    }