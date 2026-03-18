// ═══════════════════════════════════════════════
// DADOS DOS TIMES
// ═══════════════════════════════════════════════
const LORDS = [
    { id: 1,  name: 'Icebergteam',    house: 'Forja Polar',         avatar: '❄️',  color: '#00CED1', alliance: 'anel'      },
    { id: 2,  name: 'Sons of Númenor',house: 'Herdeiros de Elendil', avatar: '🛡️',  color: '#4169E1', alliance: 'bastardos' },
    { id: 3,  name: 'Ironverdict',    house: 'Forja da Justiça',    avatar: '🗡️',  color: '#8a8a8a', alliance: 'bastardos' },
    { id: 4,  name: 'CEEC',           house: 'Mestre das Espadas',  avatar: '⚔️',  color: '#8B0000', alliance: 'northclaw' },
    { id: 5,  name: 'Otopatamá',      house: 'Samurais Guerreiros', avatar: '🤖',  color: '#1E90FF', alliance: 'northclaw' },
    { id: 6,  name: 'Andorinha Jr',   house: 'Jovem Veloz',         avatar: '🐦',  color: '#FF6347', alliance: 'anel'      },
    { id: 7,  name: 'Andorinha',      house: 'Senhores do Voo',     avatar: '🦅',  color: '#DC143C', alliance: 'anel'      },
    { id: 8,  name: 'Varelitas',      house: 'Guardas da Colina',   avatar: '🦊',  color: '#228B22', alliance: 'bastardos' },
    { id: 9,  name: 'Lobonegro',      house: 'Agente do Caos',      avatar: '🐺',  color: '#7a5af0', alliance: 'bastardos' },
];

const ALLIANCES = {
    bastardos: { label: 'Bastardos',      icon: '🗡️', color: '#B0BEC5', members: 'Sons of Númenor · Ironverdict · Varelitas · Lobonegro' },
    anel:      { label: 'Sociedade do Anel', icon: '💍', color: '#74b9ff', members: 'Andorinha · Andorinha Jr · Icebergteam' },
    northclaw: { label: 'North Claw',        icon: '🐾', color: '#a29bfe', members: 'CEEC · Otopatamá' },
};

// ═══════════════════════════════════════════════
// DADOS DAS BATALHAS
// ═══════════════════════════════════════════════
const BATTLE_NAMES = [
    'Cerco do Abismo de Ferro','Massacre da Festa Escarlate','Batalha do Portão Sombrio',
    'Confronto no Tridente das Três Garfos','Queda da Torre Cinza',
    'Carnificina nos Campos do Fogo Verde','Cerco da Cidade das Torres Brancas',
    'Batalha das Águas Negras em Chamas','Assalto ao Vale das Sombras',
    'Duelo nas Minas da Montanha','Massacre do Casamento Sangrento',
    'Batalha dos Bastardos do Norte','Cerco do Ninho da Lua',
    'Confronto na Forja Flamejante','A Longa Noite dos Mortos',
    'Queda do Rochedo de Ouro','Batalha da Baía do Rei Escravo',
    'Carnificina no Bosque dos Lobos','Cerco da Muralha Eterna',
    'Massacre nos Degraus de Pedra','Batalha do Forte da Tormenta',
    'Dança Sangrenta dos Dragões','Queda das Torres Gêmeas do Rio',
    'Cerco do Porto Branco do Norte','Confronto no Jardim das Rosas Mortas',
    'Massacre do Vau Rubi','Batalha da Lagoa dos Deuses',
    'Assalto à Ponta do Dragão','Carnificina no Campo Queimado',
    'Cerco do Portão Dourado','Batalha do Inverno Eterno',
    'Queda da Coroa de Espinhos','Massacre na Cidadela do Sol',
    'Confronto nas Terras do Crepúsculo','Cerco da Fortaleza do Rei da Noite',
    'Batalha dos Sete Reinos Unidos','A Grande Guerra do Amanhecer',
    'RAGNARÖK: O FIM DE TODAS AS ERAS',
];

// BATTLES é construído dinamicamente a partir de dados.csv
let BATTLES = [];

// ═══════════════════════════════════════════════
// PARSE CSV
// ═══════════════════════════════════════════════
function parseCSV(text) {
    const rows = [];
    const lines = text.trim().split('\n');
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');
        if (parts.length < 3) {
            console.warn(`[dados.csv] Linha ${i + 1} ignorada (formato inválido): "${line}"`);
            continue;
        }
        const rodada = parseInt(parts[0].trim(), 10);
        const name   = parts[1].trim();
        const pontos = parseFloat(parts[2].trim());
        if (isNaN(rodada) || !name || isNaN(pontos)) {
            console.warn(`[dados.csv] Linha ${i + 1} ignorada (valores inválidos): "${line}"`);
            continue;
        }
        rows.push({ rodada, name, pontos });
    }
    return rows;
}

function buildBattles(rows) {
    const map = {};
    rows.forEach(r => {
        if (!map[r.rodada]) map[r.rodada] = [];
        const lord = LORDS.find(l => l.name.toLowerCase().trim() === r.name.toLowerCase().trim());
        if (!lord) {
            console.warn(`[dados.csv] Time não reconhecido: "${r.name}" (rodada ${r.rodada}). Verifique o nome no CSV.`);
            return;
        }
        map[r.rodada].push({ lordId: lord.id, points: r.pontos });
    });
    return Object.keys(map).map(Number).sort((a, b) => a - b).map(week => ({
        week,
        name: BATTLE_NAMES[week - 1] || `Batalha ${week}`,
        results: map[week],
    }));
}

// ═══════════════════════════════════════════════
// TÍTULOS
// ═══════════════════════════════════════════════
const TITLES = {
    mvp: [
        { min: 15, title: '⚡ Portador de Glamdring' },
        { min: 10, title: '🐉 O Rei que Voltou' },
        { min: 7,  title: '⚜️ Rei Coroado de Gondor' },
        { min: 5,  title: '👑 Herdeiro de Isildur' },
        { min: 3,  title: '🛡️ Senhor dos Cavaleiros de Rohan' },
        { min: 1,  title: '⚔️ Cavaleiro da Companhia' },
    ],
    mitada: [
        { min: 10, title: '⚡ Portador da Espada de Fogo' },
        { min: 7,  title: '💎 Portador da Garra Longa' },
        { min: 5,  title: '🌟 Cavaleiro do Amanhecer' },
        { min: 3,  title: '⚔️ Empunhador de Anduril' },
        { min: 1,  title: '🔥 Portador da Ferroada' },
    ],
    recuperacao: [
        { min: 7, title: '🌟 Ressurgido das Trevas' },
        { min: 5, title: '⚡ Jon Snow Ressuscitado' },
        { min: 3, title: '🐉 Renascido no Fogo' },
        { min: 1, title: '🦅 Cavaleiro do Corvo Branco' },
    ],
    massacre: [
        { min: 7, title: '🐉 Terror de Westeros' },
        { min: 5, title: '🔱 Flagelo dos Reinos' },
        { min: 3, title: '⚔️ O Senhor do Aço Negro' },
        { min: 1, title: '🗡️ Conquistador de Terras' },
    ],
    podio: [
        { min: 15, title: '💫 Protetor dos Sete Reinos' },
        { min: 10, title: '🎖️ Mão do Rei' },
        { min: 8,  title: '💍 Lorde Comandante da Muralha' },
        { min: 5,  title: '🏅 Cavaleiro da Guarda Real' },
        { min: 1,  title: '🎯 Guardião da Torre Branca' },
    ],
    lanterna: [
        { min: 10, title: '🕳️ Rei da Noite Eterna' },
        { min: 7,  title: '🌑 Prisioneiro de Mordor' },
        { min: 5,  title: '💀 Servo de Sauron' },
        { min: 3,  title: '⚰️ Habitante das Terras Sombrias' },
        { min: 1,  title: '🗡️ Banido para o Exílio' },
    ],
};

function getTitle(type, count) {
    if (!count) return '';
    for (const t of TITLES[type] || []) {
        if (count >= t.min) return t.title;
    }
    return '';
}

// ═══════════════════════════════════════════════
// CÁLCULO DE PONTOS MEDIEVAIS
// ═══════════════════════════════════════════════
function calcMedievalPoints(ach) {
    let pts = 0;
    const { mvp = 0, podio = 0, mitada = 0, recuperacao = 0, massacre = 0, lanterna = 0 } = ach;

    // MVP progressivo
    if      (mvp >= 15) pts += 200;
    else if (mvp >= 10) pts += 135;
    else if (mvp >= 7)  pts += 95;
    else if (mvp >= 5)  pts += 65;
    else if (mvp >= 3)  pts += 40;
    else                pts += mvp * 10;

    // Pódio progressivo
    if      (podio >= 15) pts += 75;
    else if (podio >= 10) pts += 45;
    else if (podio >= 8)  pts += 34;
    else if (podio >= 5)  pts += 20;
    else                  pts += podio * 3;

    // Mitada progressivo (80, 90, 100, 110 somam no mesmo contador)
    if      (mitada >= 10) pts += 100;
    else if (mitada >= 7)  pts += 70;
    else if (mitada >= 5)  pts += 45;
    else if (mitada >= 3)  pts += 23;
    else                   pts += mitada * 5;

    // Recuperação progressivo
    if      (recuperacao >= 7) pts += 96;
    else if (recuperacao >= 5) pts += 65;
    else if (recuperacao >= 3) pts += 36;
    else                       pts += recuperacao * 8;

    // Massacre progressivo
    if      (massacre >= 7) pts += 62;
    else if (massacre >= 5) pts += 40;
    else if (massacre >= 3) pts += 22;
    else                    pts += massacre * 6;

    // Lanterna — penalidade progressiva
    if      (lanterna >= 10) pts -= 100;
    else if (lanterna >= 7)  pts -= 70;
    else if (lanterna >= 5)  pts -= 45;
    else if (lanterna >= 3)  pts -= 23;
    else                     pts -= lanterna * 5;

    return pts;
}

// ═══════════════════════════════════════════════
// PROCESSAR CONQUISTAS (chamado UMA VEZ e cacheado)
// ═══════════════════════════════════════════════
function processAll() {
    const acumulado = {};
    LORDS.forEach(l => { acumulado[l.id] = 0; });

    const lordsData = LORDS.map(lord => ({
        ...lord,
        cartolaPoints: 0,
        mvp: 0, podio: 0, mitada: 0,
        recuperacao: 0, massacre: 0, lanterna: 0,
        medievalPoints: 0, totalPoints: 0,
        currentTitle: '📰 Escudeiro Sem Nome',
        bonusG2: 0,
    }));

    // Índice de busca rápida por id: O(1)
    const lordById = new Map(lordsData.map(l => [l.id, l]));

    let prevPoints = {};

    BATTLES.forEach((battle, idx) => {
        const sorted = [...battle.results].sort((a, b) => b.points - a.points);
        const acumAntes = { ...acumulado };

        battle.results.forEach(r => { acumulado[r.lordId] += r.points; });
        const acumDepois = { ...acumulado };

        // Rankings antes e depois — Map para O(1)
        const rankAntes  = Object.entries(acumAntes).sort((a, b) => b[1] - a[1]).map(e => +e[0]);
        const rankDepois = Object.entries(acumDepois).sort((a, b) => b[1] - a[1]).map(e => +e[0]);
        const posAntes   = new Map(rankAntes.map((id, i)  => [id, i]));
        const posDepois  = new Map(rankDepois.map((id, i) => [id, i]));

        sorted.forEach((result, position) => {
            const ld = lordById.get(result.lordId);
            if (!ld) return;
            ld.cartolaPoints += result.points;

            // MVP
            if (position === 0 && result.points > 0) ld.mvp++;

            // Pódio (2º ou 3º; MVP não acumula)
            if (position === 1 || position === 2) ld.podio++;

            // Mitada G1 (≥80 pts)
            if (result.points >= 80) ld.mitada++;

            // Bônus G2 por rodada
            if      (result.points >= 110) ld.bonusG2 += 14;
            else if (result.points >= 100) ld.bonusG2 += 8;
            else if (result.points >= 90)  ld.bonusG2 += 4;

            // Lanterna
            if (position === sorted.length - 1 && result.points > 0) ld.lanterna++;

            // Recuperação: +50 pts em relação à rodada anterior
            if (idx > 0 && Object.prototype.hasOwnProperty.call(prevPoints, result.lordId)) {
                if (result.points - prevPoints[result.lordId] >= 50) ld.recuperacao++;
            }

            // Massacre: ultrapassou alguém com ≥10 pts de diferença no acumulado
            if (idx > 0) {
                const myId   = result.lordId;
                const myAntes = posAntes.get(myId);
                const myDepois = posDepois.get(myId);
                const subiu  = myAntes - myDepois > 0; // posição numérica menor = melhor

                if (subiu) {
                    let temMassacre = false;
                    for (const outro of LORDS) {
                        if (outro.id === myId) continue;
                        // Estava atrás antes E está à frente depois
                        const ultrapassou =
                            posAntes.get(myId)    > posAntes.get(outro.id) &&
                            posDepois.get(myId)   < posDepois.get(outro.id);
                        if (ultrapassou) {
                            const diff = acumDepois[myId] - acumDepois[outro.id];
                            if (diff >= 10) { temMassacre = true; break; }
                        }
                    }
                    if (temMassacre) ld.massacre++;
                }
            }
        });

        battle.results.forEach(r => { prevPoints[r.lordId] = r.points; });
    });

    // Calcular pontos medievais e títulos
    lordsData.forEach(ld => {
        const ach = {
            mvp: ld.mvp, podio: ld.podio, mitada: ld.mitada,
            recuperacao: ld.recuperacao, massacre: ld.massacre, lanterna: ld.lanterna,
        };
        ld.medievalPoints = calcMedievalPoints(ach) + ld.bonusG2;
        ld.totalPoints    = ld.cartolaPoints + ld.medievalPoints;

        ld.currentTitle =
            getTitle('mvp',        ld.mvp)        ||
            getTitle('mitada',     ld.mitada)     ||
            getTitle('recuperacao',ld.recuperacao)||
            getTitle('massacre',   ld.massacre)   ||
            getTitle('podio',      ld.podio)      ||
            getTitle('lanterna',   ld.lanterna)   ||
            '📰 Escudeiro Sem Nome';
    });

    return lordsData.sort((a, b) => b.totalPoints - a.totalPoints);
}

// ═══════════════════════════════════════════════
// RENDER RANKING
// ═══════════════════════════════════════════════
function renderRanking(data) {
    const el = document.getElementById('ranking-list');

    el.innerHTML = data.map((lord, i) => {
        const posClass = i === 0 ? 'pos-1' : i === 1 ? 'pos-2' : i === 2 ? 'pos-3' : 'pos-n';
        const medClass = lord.medievalPoints >= 0 ? 'pts-medieval-pos' : 'pts-medieval-neg';
        const medSign  = lord.medievalPoints >= 0 ? '+' : '';
        const rodadas  = BATTLES.length || 1;
        const avgCartola = (lord.cartolaPoints / rodadas).toFixed(1);

        return `
        <div class="lord-card expandable"
             style="border-color:${lord.color}"
             role="button"
             tabindex="0"
             aria-expanded="false"
             aria-controls="details-${lord.id}"
             onclick="toggleDetails(${lord.id}, this)"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleDetails(${lord.id},this)}">
            ${i === 0 ? '<div class="crown-icon" aria-hidden="true">👑</div>' : ''}
            <div class="lord-header">
                <div class="position-badge ${posClass}" aria-label="${i + 1}º lugar">${i + 1}</div>
                <div class="avatar" aria-hidden="true">${lord.avatar}</div>
                <div class="lord-info">
                    <div class="lord-name">${lord.name}</div>
                    <div class="lord-house" style="color:${lord.color}">${lord.house}</div>
                    <div class="lord-title">${lord.currentTitle}</div>
                </div>
            </div>
            <div class="points-display" aria-label="Total: ${lord.totalPoints.toFixed(2)} pontos">
                <div class="total-points">${lord.totalPoints.toFixed(2)}</div>
                <div class="pts-label-main">Pontos Gerais</div>
                <div class="points-breakdown">
                    <span class="pts-cartola" title="Cartola">📊 ${lord.cartolaPoints.toFixed(2)}</span>
                    <span class="pts-sep">·</span>
                    <span class="${medClass}" title="Medieval">⚔️ ${medSign}${lord.medievalPoints}</span>
                    <span class="pts-sep">·</span>
                    <span class="pts-avg-val" title="Média Cartola">📈 ${avgCartola}/rod</span>
                </div>
            </div>
            <div class="lord-details" id="details-${lord.id}" role="region" aria-label="Detalhes de ${lord.name}">
                <div class="stats-grid">
                    <div class="stat-item"><div class="stat-label">🏆 MVP</div><div class="stat-value">${lord.mvp}x</div></div>
                    <div class="stat-item"><div class="stat-label">💀 Mitada</div><div class="stat-value">${lord.mitada}x</div></div>
                    <div class="stat-item"><div class="stat-label">🥇 Pódio</div><div class="stat-value">${lord.podio}x</div></div>
                    <div class="stat-item"><div class="stat-label">📈 Recup.</div><div class="stat-value">${lord.recuperacao}x</div></div>
                    <div class="stat-item"><div class="stat-label">🗡️ Massacre</div><div class="stat-value">${lord.massacre}x</div></div>
                    <div class="stat-item"><div class="stat-label">🔦 Lanterna</div><div class="stat-value negative">${lord.lanterna}x</div></div>
                </div>
            </div>
            <div class="expand-btn" id="indicator-${lord.id}" aria-hidden="true">▼ Toque para ver detalhes</div>
        </div>`;
    }).join('');
}

// ═══════════════════════════════════════════════
// RENDER MEDIEVAL
// ═══════════════════════════════════════════════
function renderMedieval(data) {
    const sorted = [...data].sort((a, b) => b.medievalPoints - a.medievalPoints);
    const el = document.getElementById('medieval-list');

    el.innerHTML = sorted.map(lord => {
        const medColor = lord.medievalPoints >= 0 ? '#4CAF50' : '#e74c3c';
        const medSign  = lord.medievalPoints >= 0 ? '+' : '';

        return `
        <div class="lord-card" style="border-color:${lord.color}" role="article">
            <div class="lord-header">
                <div class="avatar" aria-hidden="true">${lord.avatar}</div>
                <div class="lord-info">
                    <div class="lord-name">${lord.name}</div>
                    <div class="lord-house" style="color:${lord.color}">${lord.house}</div>
                    <div class="lord-title">${lord.currentTitle}</div>
                </div>
            </div>
            <div class="points-display" aria-label="${lord.medievalPoints} pontos medievais">
                <div class="total-points" style="color:${medColor}">${medSign}${lord.medievalPoints}</div>
                <div class="points-display-label">Pontos Medievais</div>
            </div>
            <div class="stats-grid">
                <div class="stat-item"><div class="stat-label">🏆 MVP</div><div class="stat-value">${lord.mvp}x</div></div>
                <div class="stat-item"><div class="stat-label">💀 Mitada</div><div class="stat-value">${lord.mitada}x</div></div>
                <div class="stat-item"><div class="stat-label">🥇 Pódio</div><div class="stat-value">${lord.podio}x</div></div>
                <div class="stat-item"><div class="stat-label">📈 Recup.</div><div class="stat-value">${lord.recuperacao}x</div></div>
                <div class="stat-item"><div class="stat-label">🗡️ Massacre</div><div class="stat-value">${lord.massacre}x</div></div>
                <div class="stat-item"><div class="stat-label">🔦 Lanterna</div><div class="stat-value negative">${lord.lanterna}x</div></div>
            </div>
        </div>`;
    }).join('');
}

// ═══════════════════════════════════════════════
// RENDER BATALHAS
// ═══════════════════════════════════════════════
function renderBattles(data) {
    const lordById = new Map(data.map(l => [l.id, l]));
    const el = document.getElementById('battles-list');

    el.innerHTML = BATTLES.map(battle => {
        const sorted = [...battle.results].sort((a, b) => b.points - a.points);
        const winner = lordById.get(sorted[0].lordId);

        return `
        <div class="battle-card"
             role="button"
             tabindex="0"
             aria-expanded="false"
             aria-controls="battle-res-${battle.week}"
             onclick="toggleBattle(${battle.week}, this)"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleBattle(${battle.week},this)}">
            <div class="battle-round">Rodada ${battle.week}</div>
            <div class="battle-name">${battle.name}</div>
            <div class="battle-winner">🏆 ${winner ? winner.name : '—'}</div>
            <div class="expand-btn" id="battle-ind-${battle.week}" aria-hidden="true">▼ Ver resultados</div>
            <div class="battle-results" id="battle-res-${battle.week}" role="region" aria-label="Resultados da rodada ${battle.week}">
                ${sorted.map((r, idx) => {
                    const lord = lordById.get(r.lordId);
                    if (!lord) return '';
                    const isWinner = idx === 0;
                    const isLast   = idx === sorted.length - 1;
                    const badges   = [];
                    if (isWinner && r.points > 0) badges.push('🏆');
                    if      (r.points >= 110) badges.push('🔥+110');
                    else if (r.points >= 100) badges.push('💥+100');
                    else if (r.points >= 90)  badges.push('⚡+90');
                    else if (r.points >= 80)  badges.push('💀+80');
                    if (idx < 3) badges.push('🥇');
                    if (isLast && r.points > 0) badges.push('🔦');

                    return `
                    <div class="result-row ${isWinner ? 'result-row-winner' : 'result-row-normal'}" style="border-color:${lord.color}">
                        <div class="result-left">
                            <div class="result-avatar" aria-hidden="true">${lord.avatar}</div>
                            <div>
                                <div class="result-name">${lord.name}</div>
                                ${badges.length ? `<div class="result-badges" aria-label="${badges.join(' ')}">${badges.join(' ')}</div>` : ''}
                            </div>
                        </div>
                        <div class="result-pts">${r.points.toFixed(2)}</div>
                    </div>`;
                }).join('')}
            </div>
        </div>`;
    }).join('');
}

// ═══════════════════════════════════════════════
// RENDER ACHIEVEMENTS
// ═══════════════════════════════════════════════
function renderAchievements(data) {
    const el = document.getElementById('achievements-list');

    const mvpKing = [...data].sort((a, b) => b.mvp - a.mvp)[0];
    const mitKing = [...data].sort((a, b) => b.mitada - a.mitada)[0];
    const recKing = [...data].sort((a, b) => b.recuperacao - a.recuperacao)[0];
    const masKing = [...data].sort((a, b) => b.massacre - a.massacre)[0];

    let html = '<div class="hall-section-header">⭐ DESTAQUES DA TEMPORADA ⭐</div>';

    if (mvpKing?.mvp > 0) html += `
        <div class="hall-card hall-card-mvp" role="article">
            <div class="hall-avatar" aria-hidden="true">${mvpKing.avatar}</div>
            <div class="hall-category hall-category-mvp">🏆 REI DAS VITÓRIAS</div>
            <div class="hall-name hall-name-mvp">${mvpKing.name}</div>
            <div class="hall-achievement">${mvpKing.mvp}x MVP</div>
            <div class="hall-title hall-title-mvp">${getTitle('mvp', mvpKing.mvp)}</div>
        </div>`;

    if (mitKing?.mitada > 0) html += `
        <div class="hall-card hall-card-mitada" role="article">
            <div class="hall-avatar" aria-hidden="true">${mitKing.avatar}</div>
            <div class="hall-category hall-category-mitada">💀 MESTRE DA DESTRUIÇÃO</div>
            <div class="hall-name hall-name-light">${mitKing.name}</div>
            <div class="hall-achievement">${mitKing.mitada}x Mitada (80+ pts)</div>
            <div class="hall-title hall-title-mitada">${getTitle('mitada', mitKing.mitada)}</div>
        </div>`;

    if (recKing?.recuperacao > 0) html += `
        <div class="hall-card hall-card-recuperacao" role="article">
            <div class="hall-avatar" aria-hidden="true">${recKing.avatar}</div>
            <div class="hall-category hall-category-recuperacao">📈 A FÊNIX IMORTAL</div>
            <div class="hall-name hall-name-light">${recKing.name}</div>
            <div class="hall-achievement">${recKing.recuperacao}x Recuperação</div>
            <div class="hall-title hall-title-recuperacao">${getTitle('recuperacao', recKing.recuperacao)}</div>
        </div>`;

    if (masKing?.massacre > 0) html += `
        <div class="hall-card hall-card-massacre" role="article">
            <div class="hall-avatar" aria-hidden="true">${masKing.avatar}</div>
            <div class="hall-category hall-category-massacre">🗡️ SENHOR DO MASSACRE</div>
            <div class="hall-name hall-name-light">${masKing.name}</div>
            <div class="hall-achievement">${masKing.massacre}x Massacre</div>
            <div class="hall-title hall-title-massacre">${getTitle('massacre', masKing.massacre)}</div>
        </div>`;

    html += '<hr class="divider"><div class="all-titles-header">📜 TODOS OS TÍTULOS</div>';

    html += data.map(lord => `
        <div class="lord-card" style="border-color:${lord.color}" role="article">
            <div class="lord-header">
                <div class="avatar" aria-hidden="true">${lord.avatar}</div>
                <div class="lord-info">
                    <div class="lord-name">${lord.name}</div>
                    <div class="lord-title">${lord.currentTitle}</div>
                </div>
            </div>
            <div class="stats-grid">
                ${lord.mvp > 0 ? `
                <div class="stat-item stat-item-mvp">
                    <div class="stat-label">🏆 MVP</div>
                    <div class="stat-value">${lord.mvp}x</div>
                    <div class="stat-subtitle stat-subtitle-mvp">${getTitle('mvp', lord.mvp)}</div>
                </div>` : ''}
                ${lord.mitada > 0 ? `
                <div class="stat-item stat-item-mitada">
                    <div class="stat-label">💀 Mitada</div>
                    <div class="stat-value">${lord.mitada}x</div>
                    <div class="stat-subtitle stat-subtitle-mitada">${getTitle('mitada', lord.mitada)}</div>
                </div>` : ''}
                ${lord.recuperacao > 0 ? `
                <div class="stat-item stat-item-recup">
                    <div class="stat-label">📈 Recup.</div>
                    <div class="stat-value">${lord.recuperacao}x</div>
                    <div class="stat-subtitle stat-subtitle-recup">${getTitle('recuperacao', lord.recuperacao)}</div>
                </div>` : ''}
                ${lord.massacre > 0 ? `
                <div class="stat-item stat-item-massacre">
                    <div class="stat-label">🗡️ Massacre</div>
                    <div class="stat-value">${lord.massacre}x</div>
                    <div class="stat-subtitle stat-subtitle-massacre">${getTitle('massacre', lord.massacre)}</div>
                </div>` : ''}
                ${lord.podio > 0 ? `
                <div class="stat-item">
                    <div class="stat-label">🥇 Pódio</div>
                    <div class="stat-value">${lord.podio}x</div>
                </div>` : ''}
                ${lord.lanterna > 0 ? `
                <div class="stat-item">
                    <div class="stat-label">🔦 Lanterna</div>
                    <div class="stat-value negative">${lord.lanterna}x</div>
                </div>` : ''}
            </div>
        </div>`).join('');

    el.innerHTML = html;
}

// ═══════════════════════════════════════════════
// RENDER REGRAS
// ═══════════════════════════════════════════════
function renderRules() {
    const el = document.getElementById('rules-content');
    el.innerHTML = `
    <div class="rules-section">
        <div class="rules-group-title">⚔️ GRUPO 1 — Conquistas por Rodada</div>
        <table class="rules-table">
            <thead><tr><th>Conquista</th><th>Critério</th><th>Pts</th></tr></thead>
            <tbody>
                <tr><td>🏆 MVP</td><td>1º lugar na rodada</td><td class="pts-pos">+10</td></tr>
                <tr><td>🥇 Pódio</td><td>2º ou 3º lugar <em>(MVP não acumula)</em></td><td class="pts-pos">+3</td></tr>
                <tr><td>💀 Mitada</td><td>≥ 80 pts na rodada</td><td class="pts-pos">+5</td></tr>
                <tr><td>📈 Recuperação</td><td>+50 pts vs rodada anterior</td><td class="pts-pos">+8</td></tr>
                <tr><td>🗡️ Massacre</td><td>Ultrapassa c/ 10+ pts no acumulado</td><td class="pts-pos">+6</td></tr>
                <tr><td>🔦 Lanterna</td><td>Último lugar na rodada</td><td class="pts-neg">−5</td></tr>
            </tbody>
        </table>
        <div class="rule-note">MVP e Pódio são excludentes. Quem vence a rodada recebe apenas os +10 do MVP.</div>
    </div>

    <div class="rules-section">
        <div class="rules-group-title">⚡ GRUPO 2 — Escada de Mitada <em style="font-weight:400;font-size:0.9em">(bônus extra sobre os +5 da Mitada)</em></div>
        <table class="rules-table">
            <thead><tr><th>Conquista</th><th>Critério</th><th>Bônus G2</th><th>Total</th></tr></thead>
            <tbody>
                <tr><td>⚡ Mitada 90</td><td>≥ 90 e &lt; 100 pts</td><td class="pts-bonus">+4</td><td class="pts-bonus">+9</td></tr>
                <tr><td>💥 Mitada 100</td><td>≥ 100 e &lt; 110 pts</td><td class="pts-bonus">+8</td><td class="pts-bonus">+13</td></tr>
                <tr><td>🔥 Mitada 110</td><td>≥ 110 pts</td><td class="pts-bonus">+14</td><td class="pts-bonus">+19</td></tr>
            </tbody>
        </table>
        <div class="rule-note">A Escada sempre acumula com a Mitada do G1. Quem faz 95 pts recebe +5 (Mitada) + +4 (Mitada 90) = +9 total. Apenas um nível da escada por rodada.</div>
    </div>

    <div class="rules-section">
        <div class="rules-group-title">🏆 Prêmios Finais — Rodada 38</div>
        <table class="rules-table">
            <thead><tr><th>Posição</th><th>Título</th><th>Bônus</th></tr></thead>
            <tbody>
                <tr><td>🥇 1º Lugar</td><td>🐉 Imperador dos Sete Reinos</td><td class="pts-pos">+50</td></tr>
                <tr><td>🥈 2º Lugar</td><td>👑 Príncipe de Pedra do Dragão</td><td class="pts-pos">+30</td></tr>
                <tr><td>🥉 3º Lugar</td><td>⚔️ Senhor de Winterfell</td><td class="pts-pos">+20</td></tr>
                <tr><td>💀 Último</td><td>🕳️ O Esquecido pelas Crônicas</td><td class="pts-neg">−30</td></tr>
            </tbody>
        </table>
        <table class="rules-table">
            <thead><tr><th>Prêmio Especial</th><th>Condição</th><th>Bônus</th></tr></thead>
            <tbody>
                <tr><td>👑 Campeão Invicto</td><td>1º sem nunca ser Lanterna</td><td class="pts-pos">+50</td></tr>
                <tr><td>🐉 A Virada dos Dragões</td><td>Campeão vindo do 6º ou abaixo</td><td class="pts-pos">+40</td></tr>
                <tr><td>🏆 Rei das Vitórias</td><td>Mais MVPs na temporada</td><td class="pts-pos">+35</td></tr>
                <tr><td>🎯 Perfeição Encarnada</td><td>Maior média Cartola</td><td class="pts-pos">+30</td></tr>
            </tbody>
        </table>
    </div>

    <div class="rules-section">
        <div class="rules-group-title">📈 Bônus Progressivos por Conquista</div>
        <div class="rule-note">Quanto mais conquistas acumuladas na temporada, maior o bônus total. Ao atingir um novo marco, o valor sobe para o patamar correspondente.</div>

        <div class="rules-prog-block">
            <div class="rules-prog-label">🏆 MVP — teto 200 pts</div>
            <table class="rules-table">
                <thead><tr><th>Acumulado</th><th>Pts Totais</th><th>Título</th></tr></thead>
                <tbody>
                    <tr><td>1x</td><td class="pts-pos">10</td><td>⚔️ Cavaleiro da Companhia</td></tr>
                    <tr><td>3x</td><td class="pts-pos">40</td><td>🛡️ Senhor dos Cavaleiros de Rohan</td></tr>
                    <tr><td>5x</td><td class="pts-pos">65</td><td>👑 Herdeiro de Isildur</td></tr>
                    <tr><td>7x</td><td class="pts-pos">95</td><td>⚜️ Rei Coroado de Gondor</td></tr>
                    <tr><td>10x</td><td class="pts-pos">135</td><td>🐉 O Rei que Voltou</td></tr>
                    <tr><td>15x</td><td class="pts-pos">200</td><td>⚡ Portador de Glamdring</td></tr>
                </tbody>
            </table>
        </div>

        <div class="rules-prog-block">
            <div class="rules-prog-label">🥇 Pódio — teto 75 pts</div>
            <table class="rules-table">
                <thead><tr><th>Acumulado</th><th>Pts Totais</th><th>Título</th></tr></thead>
                <tbody>
                    <tr><td>1x</td><td class="pts-pos">3</td><td>🎯 Guardião da Torre Branca</td></tr>
                    <tr><td>5x</td><td class="pts-pos">20</td><td>🏅 Cavaleiro da Guarda Real</td></tr>
                    <tr><td>8x</td><td class="pts-pos">34</td><td>💍 Lorde Comandante da Muralha</td></tr>
                    <tr><td>10x</td><td class="pts-pos">45</td><td>🎖️ Mão do Rei</td></tr>
                    <tr><td>15x</td><td class="pts-pos">75</td><td>💫 Protetor dos Sete Reinos</td></tr>
                </tbody>
            </table>
        </div>

        <div class="rules-prog-block">
            <div class="rules-prog-label">💀 Mitada — teto 100 pts <em style="font-weight:400;font-size:0.9em">(G1 + G2 somam no mesmo contador)</em></div>
            <table class="rules-table">
                <thead><tr><th>Acumulado</th><th>Pts Totais</th><th>Título</th></tr></thead>
                <tbody>
                    <tr><td>1x</td><td class="pts-pos">5</td><td>🔥 Portador da Ferroada</td></tr>
                    <tr><td>3x</td><td class="pts-pos">23</td><td>⚔️ Empunhador de Andúril</td></tr>
                    <tr><td>5x</td><td class="pts-pos">45</td><td>🌟 Cavaleiro do Amanhecer</td></tr>
                    <tr><td>7x</td><td class="pts-pos">70</td><td>💎 Portador da Garra Longa</td></tr>
                    <tr><td>10x</td><td class="pts-pos">100</td><td>⚡ Portador da Espada de Fogo</td></tr>
                </tbody>
            </table>
        </div>

        <div class="rules-prog-block">
            <div class="rules-prog-label">📈 Recuperação — teto 96 pts</div>
            <table class="rules-table">
                <thead><tr><th>Acumulado</th><th>Pts Totais</th><th>Título</th></tr></thead>
                <tbody>
                    <tr><td>1x</td><td class="pts-pos">8</td><td>🦅 Cavaleiro do Corvo Branco</td></tr>
                    <tr><td>3x</td><td class="pts-pos">36</td><td>🐉 Renascido no Fogo</td></tr>
                    <tr><td>5x</td><td class="pts-pos">65</td><td>⚡ Jon Snow Ressuscitado</td></tr>
                    <tr><td>7x</td><td class="pts-pos">96</td><td>🌟 Ressurgido das Trevas</td></tr>
                </tbody>
            </table>
        </div>

        <div class="rules-prog-block">
            <div class="rules-prog-label">🗡️ Massacre — teto 62 pts</div>
            <table class="rules-table">
                <thead><tr><th>Acumulado</th><th>Pts Totais</th><th>Título</th></tr></thead>
                <tbody>
                    <tr><td>1x</td><td class="pts-pos">6</td><td>🗡️ Conquistador de Terras</td></tr>
                    <tr><td>3x</td><td class="pts-pos">22</td><td>⚔️ O Senhor do Aço Negro</td></tr>
                    <tr><td>5x</td><td class="pts-pos">40</td><td>🔱 Flagelo dos Reinos</td></tr>
                    <tr><td>7x</td><td class="pts-pos">62</td><td>🐉 Terror de Westeros</td></tr>
                </tbody>
            </table>
        </div>

        <div class="rules-prog-block">
            <div class="rules-prog-label rules-prog-label-neg">🔦 Lanterna — penalidade máxima −100 pts</div>
            <table class="rules-table">
                <thead><tr><th>Acumulado</th><th>Penalidade</th><th>Título</th></tr></thead>
                <tbody>
                    <tr><td>1x</td><td class="pts-neg">−5</td><td>🗡️ Banido para o Exílio</td></tr>
                    <tr><td>3x</td><td class="pts-neg">−23</td><td>⚰️ Habitante das Terras Sombrias</td></tr>
                    <tr><td>5x</td><td class="pts-neg">−45</td><td>💀 Servo de Sauron</td></tr>
                    <tr><td>7x</td><td class="pts-neg">−70</td><td>🌑 Prisioneiro de Mordor</td></tr>
                    <tr><td>10x</td><td class="pts-neg">−100</td><td>🕳️ Rei da Noite Eterna</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="rules-section">
        <div class="rules-group-title">🏰 Os Nove Reinos</div>
        <table class="rules-table">
            <thead><tr><th>Reino</th><th>Casa</th><th></th></tr></thead>
            <tbody>
                ${LORDS.map(l => `<tr><td style="color:${l.color};font-weight:700">${l.name}</td><td>${l.house}</td><td style="font-size:1.4em" aria-hidden="true">${l.avatar}</td></tr>`).join('')}
            </tbody>
        </table>
    </div>
    `;
}

// ═══════════════════════════════════════════════
// TOGGLE / NAVEGAÇÃO
// ═══════════════════════════════════════════════
function toggleDetails(id, cardEl) {
    const d = document.getElementById(`details-${id}`);
    const i = document.getElementById(`indicator-${id}`);
    const show = d.classList.toggle('show');
    i.textContent = show ? '▲ Toque para recolher' : '▼ Toque para ver detalhes';
    if (cardEl) cardEl.setAttribute('aria-expanded', show ? 'true' : 'false');
}

function toggleBattle(week, cardEl) {
    const r = document.getElementById(`battle-res-${week}`);
    const i = document.getElementById(`battle-ind-${week}`);
    const show = r.classList.toggle('show');
    i.textContent = show ? '▲ Recolher' : '▼ Ver resultados';
    if (cardEl) cardEl.setAttribute('aria-expanded', show ? 'true' : 'false');
}

// ════════════════════════════════════════════════
// RENDER ALIANÇAS
// ════════════════════════════════════════════════
function renderAliancas(data) {
    const sumT = arr => arr.reduce((s, l) => s + l.totalPoints, 0);
    const avgT = arr => sumT(arr) / arr.length;

    // Montar stats das 3 alianças e ordenar por pontuação
    const alStats = Object.entries(ALLIANCES).map(([key, al]) => {
        const memberData = data.filter(l => l.alliance === key);
        return {
            key,
            memberData,
            pts: sumT(memberData),
            avg: memberData.length ? avgT(memberData) : 0,
            ...al,
        };
    }).sort((a, b) => b.pts - a.pts);

    const medalha = ['🥇', '🥈', '🥉'];

    const memberRow = (lord, alKey) => {
        const statsSpans = [
            lord.mvp        ? `<span>🏆 ${lord.mvp}</span>`                        : '',
            lord.mitada     ? `<span>💀 ${lord.mitada}</span>`                      : '',
            lord.podio      ? `<span>🥇 ${lord.podio}</span>`                       : '',
            lord.recuperacao? `<span>📈 ${lord.recuperacao}</span>`                 : '',
            lord.massacre   ? `<span>🗡️ ${lord.massacre}</span>`                   : '',
            lord.lanterna   ? `<span class="al-stat-neg">🔦 ${lord.lanterna}</span>`: '',
        ].filter(Boolean).join('');

        return `
    <div class="al-member-row ${alKey}">
        <div class="al-member-avatar" aria-hidden="true">${lord.avatar}</div>
        <div class="al-member-info">
            <div class="al-member-name">${lord.name}</div>
            <div class="al-member-title">${lord.currentTitle || '📰 Escudeiro Sem Nome'}</div>
            ${statsSpans ? `<div class="al-member-stats">${statsSpans}</div>` : ''}
        </div>
        <div class="al-member-pts">
            <div class="al-member-pts-main">${lord.totalPoints.toFixed(0)}</div>
            <div class="al-member-pts-sub">📊 ${lord.cartolaPoints.toFixed(2)}</div>
        </div>
    </div>`;
    };

    const scoreboard = `
    <div class="al-scoreboard" role="region" aria-label="Placar das Alianças">
        <div class="al-scoreboard-title">Placar Geral das Alianças</div>
        ${alStats.map((al, i) => `
        <div class="al-rank-row">
            <div class="al-rank-pos" aria-label="${i + 1}º lugar">${medalha[i] || `${i + 1}º`}</div>
            <div class="al-rank-icon" aria-hidden="true">${al.icon}</div>
            <div class="al-rank-info">
                <div class="al-rank-name" style="color:${al.color}">${al.label}</div>
                <div class="al-rank-avg">${al.memberData.length} membro${al.memberData.length !== 1 ? 's' : ''}</div>
            </div>
            <div class="al-rank-pts-block">
                <div class="al-rank-pts" style="color:${al.color}">${al.pts.toFixed(0)}</div>
                <div class="al-rank-pts-avg">⌀ ${al.avg.toFixed(1)}</div>
            </div>
        </div>`).join('')}
    </div>`;

    const blocks = alStats.map((al, i) => `
    <div class="al-block">
        <div class="al-header-card ${al.key}" role="heading" aria-level="3">
            <div class="al-header-icon" aria-hidden="true">${al.icon}</div>
            <div class="al-header-info">
                <div class="al-header-name ${al.key}">${al.label}</div>
                <div class="al-header-sub">${al.members}</div>
            </div>
            <div class="al-header-total">
                <div class="al-header-pts ${al.key}">${al.pts.toFixed(0)}</div>
            </div>
        </div>
        ${al.memberData.sort((a, b) => b.totalPoints - a.totalPoints).map(l => memberRow(l, al.key)).join('')}
    </div>
    ${i < alStats.length - 1 ? '<div class="al-vs-divider" aria-hidden="true">— VS —</div>' : ''}`).join('');

    document.getElementById('aliancas-content').innerHTML = scoreboard + blocks;
}

function switchTab(name, btn) {
    document.querySelectorAll('.tab-content').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
    });
    const tab = document.getElementById(`tab-${name}`);
    tab.classList.add('active');
    tab.setAttribute('aria-hidden', 'false');
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══════════════════════════════════════════════
// INICIALIZAR
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('dados.csv?v=' + Date.now());
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const csv  = await res.text();
        const rows = parseCSV(csv);
        if (!rows.length) throw new Error('dados.csv vazio ou formato inválido.');
        BATTLES = buildBattles(rows);

        if (!BATTLES.length) throw new Error('Nenhuma batalha encontrada no CSV.');

        const lastRound = Math.max(...BATTLES.map(b => b.week));
        const roundEl   = document.getElementById('current-round');
        if (roundEl) roundEl.textContent = lastRound;

        // processAll() é chamado UMA VEZ e o resultado é compartilhado por todas as funções
        const data = processAll();

        renderRanking(data);
        renderAliancas(data);
        renderMedieval(data);
        renderBattles(data);
        renderAchievements(data);
        renderRules();

    } catch (err) {
        document.body.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                        min-height:100vh;padding:24px;text-align:center;background:#0d0d1a;"
                 role="alert">
                <div style="font-size:3em;margin-bottom:16px;" aria-hidden="true">🏚️</div>
                <div style="font-family:Cinzel,serif;color:#e74c3c;font-size:1.2em;margin-bottom:12px;">
                    Erro ao carregar dados
                </div>
                <div style="color:#9988aa;font-size:0.95em;line-height:1.6;">
                    ${err.message}<br><br>
                    Verifique se <strong style="color:#DAA520">dados.csv</strong> está na mesma pasta que index.html.
                </div>
            </div>`;
        console.error('[Guerra dos Reinos]', err);
    }
});
