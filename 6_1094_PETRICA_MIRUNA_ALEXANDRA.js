let stiva = []; 

//Functie care primeste o forma din svg si o adauga in stiva,
//pentru ca ulterior sa o poata scoate din stiva pentru a o elimina
//la apasarea butonului de undo

function adauga(shape) {
    stiva.push(shape.cloneNode(true)); 
}

//functie care permite anularea utlimelor operatii
function undo() {
    const svg = document.getElementById('editor');
    if (stiva.length > 0) {
        svg.removeChild(svg.lastChild);
        stiva.pop(); 
    }
}

        let esteDreptunghi = false;
        let esteElipsa = false;
        let esteLinie=false;

        let startX, startY, shape;
        let culoare = '#ca7373';
        let grosime = 3;

        document.getElementById('editor').addEventListener('mousedown', incepeDesen);
        document.getElementById('editor').addEventListener('mousemove', deseneaza);
        document.getElementById('editor').addEventListener('mouseup', terminaDesen);

        document.getElementById('alegeCuloare').addEventListener('change', schimbaCuloare);
        document.getElementById('alegeGrosime').addEventListener('change', schimbaGrosime);
        

        //schimba culoarea pentru forma care va fi desenata
        //daca forma indeplineste conditia din IF (se face click pe ea), i se poate schimba culoarea
        function schimbaCuloare() {
            const alegere = document.getElementById('alegeCuloare');
            culoare = alegere.value;

            const targetShape = document.querySelector('.focused');
            if (targetShape) {
                targetShape.setAttribute('stroke', culoare);
                
            } 
        }

        //schimba grosimea conturului pentru forma care va fi desenata
        //daca pe forma se face click ulterior (este targetShape), i se poate schimba grosimea conturului

        function schimbaGrosime() {
            const gLinie = document.getElementById('alegeGrosime').value;
            grosime=gLinie;

            const targetShape = document.querySelector('.focused');
            if (targetShape) {
                targetShape.setAttribute('stroke-width', gLinie);
            }
           
        }


        //seteaza pozitiile actuale ale cursorului pe axa verticala si orizontala
        //este apelata atunci cand se face click in interiorul svg
        //verifica ce forma este si creeaza elementul respectiv folosind namespace-ul svg
        //in cazul desenarii liniei, seteaza coordonatele initiale si finale(sunt aceleasi la inceput)
        function incepeDesen(event) {
            const svg = document.getElementById('editor');
            const x = event.clientX - svg.getBoundingClientRect().left;
            const y = event.clientY - svg.getBoundingClientRect().top;

            if (esteDreptunghi) {
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            } else if (esteElipsa) {
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            } else if (esteLinie) {
                shape = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                shape.setAttribute('x1', x);
                shape.setAttribute('y1', y);
                shape.setAttribute('x2', x);
                shape.setAttribute('y2', y);
            }

            shape.setAttribute('stroke', culoare);
            shape.setAttribute('stroke-width', grosime);
            shape.setAttribute('fill', 'none');

            startX = x;
            startY = y;
            shape.setAttribute('x', startX);
            shape.setAttribute('y', startY);

            //adauga forma in interiorul svg
            svg.appendChild(shape);

            //stergerea unei forme atunci cand se apasa tasta Backspae
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Backspace') {
                    
                    const targetShape = document.querySelector('.focused');
                    //daca se face click pe o forma, aceasta devine targetShape si va putea fi stearsa
                    //cu tasta Backspace
                    if (targetShape) {
                        targetShape.remove();
                    }
                }
            });
        

            //marcheaza ca selectata numai forma pe care utilizatorul face click
            shape.addEventListener('click', function(event) {

               // selectează toate elementele care sunt descendenti directi ai elementului <svg>.
                const figuri = document.querySelectorAll('svg > *');

                //scoate clasa .focused de pe toate formele,
                //ca sa se asigure ca numai forma pe care utilizatorul a facut click 
                //este marcata ca selectata
                figuri.forEach(shape => shape.classList.remove('focused'));
                //selecteaza forma numai cand se face click pe ea
                event.target.classList.add('focused');
               
            });

            document.getElementById('alegeGrosime').onchange = schimbaGrosime;
            document.getElementById('alegeCuloare').onchange = schimbaCuloare;
            
            //adauga in stiva pentru a putea aplica Undo ulterior
           adauga(shape);

        }

        //actualizeaza forma in timp ce este desenata
        //ajusteaza forma in functie de tipul ei
        function deseneaza(event) {
            if (!shape) return;

            const svg = document.getElementById('editor');
            const x = event.clientX - svg.getBoundingClientRect().left;
            const y = event.clientY - svg.getBoundingClientRect().top;

            const width = x - startX;
            const height = y - startY;

            if (esteDreptunghi) {
                shape.setAttribute('width', Math.abs(width));
                shape.setAttribute('height', Math.abs(height));
            } else if (esteElipsa) {
                shape.setAttribute('rx', Math.abs(width) / 2);
                shape.setAttribute('ry', Math.abs(height) / 2);
                shape.setAttribute('cx', startX + width / 2);
                shape.setAttribute('cy', startY + height / 2);
            } else if (esteLinie) {
                shape.setAttribute('x2', x);
                shape.setAttribute('y2', y);
            }
        }

        //sfarseste interactiunea cu aplicatia
        //se declanseaza la mouseup
        //seteaza faptul ca nu mai e nicio forma in lucru
        function terminaDesen() {
            shape = null;
        }


        function deseneazaElipsa() {
            //stabileste ce tip de forma este
            esteElipsa = true;
            esteDreptunghi = false;
            esteLinie=false;
            //aplica functiile de desenare pe svg
            const svg = document.getElementById('editor');
            svg.addEventListener('mousedown', incepeDesen);
            svg.addEventListener('mousemove', deseneaza);
            document.addEventListener('mouseup', terminaDesen);

            const alegere = document.getElementById('alegeCuloare');
            alegere.addEventListener('change', schimbaCuloare);

        }

        function deseneazaDreptunghi() {
            //stabileste ce tip de forma este
            esteDreptunghi = true;
            esteElipsa = false;
            esteLinie=false;
            //aplica functiile de desenare pe svg
            const svg = document.getElementById('editor');
            svg.addEventListener('mousedown', incepeDesen);
            svg.addEventListener('mousemove', deseneaza);
            document.addEventListener('mouseup', terminaDesen);
        }

        function deseneazaLinie() {
            //stabileste ce tip de forma este
            esteLinie=true;
            esteElipsa = false;
            esteDreptunghi = false;
            //aplica functiile de desenare pe svg
            const svg = document.getElementById('editor');
            svg.addEventListener('mousedown', incepeDesen);
            svg.addEventListener('mousemove', deseneaza);
            document.addEventListener('mouseup', terminaDesen);
        }




// functie care salveaza continutul SVG curent pentru a-l descarca.

function salveazaSVG() {
    const svgElement = document.getElementById('editor');
    //serializeaza continutul SVG
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    // creaza un obiect Blob cu continutul serializat 
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    // il converteste intr-un URL
    const url = URL.createObjectURL(blob);

    // creeaza un element de ancora care are ca destinatie URL-ul generat
    // pentru a putea fi descarcat 
    const a = document.createElement('a');
    a.href = url;
    a.download = 'desen.svg'; 
    a.click();

    URL.revokeObjectURL(url);
}
    