import { eliminaCorpoArma } from "../HANDLEGAME/eliminaCorpoArma";
import { giveWarningMessage } from "../HANDLEMESSAGES/warningMessage";
import { util } from "../main";

export function deployRaggioAzioneLaser(): Promise<boolean> {
    return new Promise((res, rej) => {
        let isBlueCell = false;
        // controllo che la cella selezionata sia del colore del giocatore (blue)
        const selectedCell = document.querySelector(`.${util.selectedCell}`);

        if (selectedCell) {
            selectedCell.classList.contains("blue") ? (isBlueCell = true) : (isBlueCell = false);

            if (!isBlueCell) {
                giveWarningMessage("puoi piantare la torretta solo sulle tue caselle.");
                return;
            }
            // pulisco array ogni qual volta voglio fare il deploy di un arma - pulisco array nel quale verrà posizionato corpo arma
            // pulisco array nel quale inserisco raggio azione arma, in questo caso laser
            util.raggioAzioneArma.length = 0;
            util.corpoArmaLaser.length = 0;
            // pusho in array corpoarma tutte quelle stringhe che mi identificano le classi del corpo dell arma.
            util.corpoArmaLaser.push(
                "c" + (parseInt(util.selectedCell.slice(1)) + 0).toString(),
                "c" + (parseInt(util.selectedCell.slice(1)) + 1).toString(),
                "c" + (parseInt(util.selectedCell.slice(1)) - 1).toString(),
                "c" + (parseInt(util.selectedCell.slice(1)) + 42).toString(),
                "c" + (parseInt(util.selectedCell.slice(1)) + 43).toString(),
                "c" + (parseInt(util.selectedCell.slice(1)) + 44).toString(),
                "c" + (parseInt(util.selectedCell.slice(1)) - 42).toString(),
                "c" + (parseInt(util.selectedCell.slice(1)) - 43).toString(),
                "c" + (parseInt(util.selectedCell.slice(1)) - 44).toString()
            );

            // le celle contenenti queste classi cambiano colore e diventano il corpo dell arma laser
            util.corpoArmaLaser.forEach((value) => {
                let cell = document.querySelector(`.${value}`);
                cell?.classList.add("corpoLaser");
            });

            // adesso in maniera ciclica (setinterval) vado prendendendo le tre caselle di fronte al corpo del arma e le cambio di colore finche non incontro una cella con classe "b" , bordo della griglia , che mi fare interropmere il ciclo.
            raggioAzioneLaser();
        }

        res(true);
    });
}

function raggioAzioneLaser() {
    console.log("sono in raggio azione laser ");
    // mi prendo le tre caselle superiori del corpo della torretta e per ognuna di esse faccio partire un setinterval che gli fa mangiare la casella davanti a se ogni x ms
    // le prime tre cell da cui far partire il ciclo sono le ultime tre presenti in util.corpoarma

    // prendo gli ultimi 3 valori dall array che corrispondono alle 3 caselle fontali del laser, da cui faccio partire un ciclo
    console.log(util.corpoArmaLaser);
    let cellSnClass = util.corpoArmaLaser[util.corpoArmaLaser.length - 1];
    let cellCentrClass = util.corpoArmaLaser[util.corpoArmaLaser.length - 2];
    let cellDxClass = util.corpoArmaLaser[util.corpoArmaLaser.length - 3];

    console.log(cellSnClass, cellCentrClass, cellDxClass);

    // prendo le caselle dal DOM
    const cellSn = document.querySelector(`.${cellSnClass}`);
    const cellCentr = document.querySelector(`.${cellCentrClass}`);
    const cellDx = document.querySelector(`.${cellDxClass}`);

    if (cellSn && cellCentr && cellDx) {
        avanzaLaser(cellSnClass);
        avanzaLaser(cellCentrClass);
        avanzaLaser(cellDxClass);
    }
}

export function avanzaLaser(classeRef: string) {
    console.log(classeRef);
    let numero = parseInt(classeRef.slice(1)); // Estrai la parte numerica e convertila in numero
    console.log(numero);
    let somma = numero - 43; // Somma il valore desiderato iniziale

    // inserisco tutti i riferimenti ai setinterval generati in un array , quando devo chiamare pausa chiamo la funzione di stop "stopAvanzaLaser()" che ferma tutti gli interval pushati nell array.

    let id = setInterval(() => {
        // se il gioco è in pausa, quindi la variabile è false, non fare nulla e ritorna.
        if (!util.isGameStarted) {
            return;
        }

        const nuovaClasse = `c${somma}`; // Crea la nuova stringa con il prefisso "c"
        console.log("sono in start laser");
        console.log("nuovaClasse", nuovaClasse);

        const cellaAvanti = document.querySelector(`.${nuovaClasse}`); // Seleziona l'elemento con la nuova classe

        // se ilraggio laser raggiunge la fine della griglia (celle con classe "b"), l'interval viene automaticamente interrotto per quel raggio laser (fila di celle)
        if (cellaAvanti && cellaAvanti.classList.contains("b")) {
            clearInterval(id);
            console.log("intervallo interrotto");
        }
        // altrimenti continua la propagazione
        // per identificare a quale div è stato aggiunto il laser gli inserisco un laser insieme a datetime.now() in modo da avere un riferimento temporale a quale div è stato aggiunto per ultimo. in modo tale da poterlo adentificare all occorrenza. FIX: NO ATTRIBUTO
        if (cellaAvanti) {
            if (!cellaAvanti.classList.contains("blue") && !cellaAvanti.classList.contains("b")) {
                cellaAvanti.classList.add("blue");
                cellaAvanti.classList.remove("red");
                cellaAvanti.classList.add("laser");
                cellaAvanti.classList.add("flip-cell");
                eliminaCorpoArma(cellaAvanti);
            }
            somma -= 43; // Aggiorna somma per la prossima iterazione
        }
    }, 50);
}
