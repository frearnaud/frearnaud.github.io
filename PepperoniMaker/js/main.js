// ============================================================
// ============================================================


// == Fonction d'initialisation du jeu
// ===================================
function init() {
	// -- Initialisation des controles globaux
	// ---------------------------------------
	globalControls = new globalControls();

	// -- Création des objets
	// ----------------------
	pizza = new pizza(0, 0);
	money = new money(0, 0.5);
	pizzaioloControls = new itemControls(600, 1);
	fourControls = new itemControls(15000, 15);
	pizzeriaControls = new itemControls(250000, 80);
	usineControls = new itemControls(1000000, 250);

	sellControls = new itemForSellControls(1, 10, 0);
	sellBoxControls = new itemForSellControls(10, 97, 0);
	sellCarControls = new itemForSellControls(100, 950, 0);
	sellTruckControls = new itemForSellControls(1000, 9300, 0);

	// -- Actualisation de la fenêtre
	// ------------------------------
	globalControls.refresh();
	globalControls.updateCpt();

	$('#sellPizzas').css('display', "none");
}

// == Objet Pizza
// ==============
function pizza(nbPizzas, pizzaPSec, prixPizza) {
	this.cptPizza = nbPizzas;
	this.pizzaAddedPS = pizzaPSec;
	this.coef = 1;
	this.pizzaAllTime = 0;

	var prix = prixPizza;

	// -- Fonction de clic pizza
	// -------------------------
	this.addPizza = function () {
		this.cptPizza += this.coef;
		this.pizzaAllTime += this.coef;
		globalControls.refresh();
	}

	// -- Fonction de vente de pizza
	// -----------------------------
	this.sellPizza = function () {
		this.cptPizza--;
		money.sumBank += 10;
		globalControls.refresh();
	}

	// -- Fonction GET de pizza
	// ------------------------
	this.getCptPizza = function () { return this.cptPizza; }
	this.getPizzaPS = function () { return this.pizzaAddedPS; }
	this.getPrix = function () { return prix; }
	this.getPizzaAllTime = function () { return this.pizzaAllTime; }
}

// == Objet argent
// ===============
function money(bank, moneyPSec) {
	this.sumBank = bank;
	this.moneyAddedPS = moneyPSec;

	// -- Fonction GET de money
	// ------------------------
	this.getMoney = function () { return this.sumBank | 0; }
	this.getMoneyPS = function () { return this.moneyAddedPS; }
}

// == Objet ITEM générique
// =======================
function itemControls(basePrice, pizzaPerSeconds) {
	var prixBase = basePrice;
	var pizzaPerSec = pizzaPerSeconds;

	var prix = prixBase;
	var nbItem = 0;
	var PPSTotal = 0;

	// -- Fonction d'achat de l'objet
	// ------------------------------
	this.buyItem = function () {
		nbItem++;

		money.sumBank -= prix;
		prix = parseInt(prix + prix * .18);
		pizza.pizzaAddedPS += pizzaPerSec;

		PPSTotal += pizzaPerSec;

		globalControls.refresh();
	}

	// -- Fonction GET de l'item
	// -------------------------
	this.getPrixBase = function () { return prixBase; }
	this.getPPSItemBase = function () { return pizzaPerSec; }
	this.getPrix = function () { return prix; }
	this.getNbItem = function () { return nbItem; }
	this.getPPSItem = function () { return PPSTotal; }
}

// == Objet ITEM (vente pizza) générique
// =====================================
function itemForSellControls(basePrice, baseGain, moneyPerSeconds) {
	var baseMoneyGain = baseGain;

	var moneyPerSec = moneyPerSeconds;

	var prix = basePrice;
	var moneyGain = baseMoneyGain;

	var nbItem = 0;
	var moneyPSTotal = 0;

	// -- Fonction de vente pizzas
	// ---------------------------
	this.sellPizzas = function () {
		nbItem++;

		pizza.cptPizza -= prix;
		money.sumBank += moneyGain;

		moneyPSTotal += moneyPerSec;

		globalControls.refresh();
	}

	// -- Fonction GET de l'item
	// -------------------------
	this.getGainBase = function () { return baseMoneyGain; }
	this.getMoneyPSBase = function () { return moneyPerSec; }
	this.getPrix = function () { return prix; }
	this.getGain = function () { return moneyGain; }
	this.getMoneyPS = function () { return moneyPSTotal; }
}

// =============================================
// ============== CONTROLE GLOBAL ==============
// =============================================

function globalControls() {

	// -- Fonction permettant de formater un nombre
	// --------------------------------------------
	this.fNb = function (number) {
		var nb = '' + number;
		var formatedNumber = '';
		var count = 0;

		for (var i = nb.length - 1; i >= 0; i--) {
			if (count != 0 && count % 3 == 0)
				formatedNumber = nb[i] + ' ' + formatedNumber;
			else
				formatedNumber = nb[i] + formatedNumber;

			count++;
		}

		return formatedNumber;
	}

	// -- Fonction permettant de mettre à jour les variables
	// -----------------------------------------------------
	this.updateCpt = function () {
		pizza.cptPizza += pizza.pizzaAddedPS;
		pizza.pizzaAllTime += pizza.pizzaAddedPS;

		money.sumBank += money.moneyAddedPS;

		this.refresh();

		setTimeout('globalControls.updateCpt()', 1000);
	}

	// -- Fonction de rafraichissement de la page
	// ------------------------------------------
	this.refresh = function () {
		// -- Compteurs
		// ------------
		$('#cptPizza').text(this.fNb(pizza.getCptPizza()));
		$('#moneyBank').text(this.fNb(money.getMoney()));
		$('#pizzaAddedPS').text(this.fNb(pizza.getPizzaPS()));
		$('#moneyAddedPs').text(this.fNb(money.getMoneyPS()));
		$('#pizzaAllTime').text(this.fNb(pizza.getPizzaAllTime()));

		// -- Achats
		// ---------
		$('#prixPizzaiolo').text(this.fNb(pizzaioloControls.getPrix()));
		$('#nbPizzaiolo').text(this.fNb(pizzaioloControls.getNbItem()));
		$('#pizzaioloPPS').text(this.fNb(pizzaioloControls.getPPSItem()));

		$('#prixFour').text(this.fNb(fourControls.getPrix()));
		$('#nbFour').text(this.fNb(fourControls.getNbItem()));
		$('#fourPPS').text(this.fNb(fourControls.getPPSItem()));

		$('#prixPizzeria').text(this.fNb(pizzeriaControls.getPrix()));
		$('#nbPizzeria').text(this.fNb(pizzeriaControls.getNbItem()));
		$('#pizzeriaPPS').text(this.fNb(pizzeriaControls.getPPSItem()));

		$('#prixUsine').text(this.fNb(usineControls.getPrix()));
		$('#nbUsine').text(this.fNb(usineControls.getNbItem()));
		$('#usinePPS').text(this.fNb(usineControls.getPPSItem()));

		// -- Ventes
		// ---------
		$('#prixPizza').text(this.fNb(sellControls.getPrix()));
		$('#prixPbox').text(this.fNb(sellBoxControls.getPrix()));
		$('#prixCar').text(this.fNb(sellCarControls.getPrix()));
		$('#prixTruck').text(this.fNb(sellTruckControls.getPrix()));

		// -- Autres 
		// ---------
		document.title = this.fNb(pizza.getCptPizza()) + ' Pizzas - Pepperoni Maker 1.0.0';
	}

	// -- Fonction permettant de changer de shop
	// -- achat à vente et vice versa ----------
	// -----------------------------------------
	this.switchShop = function () {
		if ($('#listObj').css('display') == "inline-block") {
			$('#listObj').css('display', "none");
			$('#sellPizzas').css('display', "inline-block");

			$('#buttonShop').text("Buy");
		}
		else {
			$('#listObj').css('display', "inline-block");
			$('#sellPizzas').css('display', "none");

			$('#buttonShop').text("Sell");
		}
	}

	// -- Fonction se déclenchant quand l'utilisateur
	// -- clique sur le div de la pizza -------------
	// ----------------------------------------------
	this.clickPizza = function () { pizza.addPizza(); }

	// -- Fonction se déclenchant quand l'utilisateur 
	// -- clique sur le div d'achat de pizzaiolo ----
	// ----------------------------------------------
	this.clickBuyPizzaiolo = function () {
		if (money.sumBank >= pizzaioloControls.getPrix())
			pizzaioloControls.buyItem();
	}

	// -- Fonction se déclenchant quand l'utilisateur 
	// -- clique sur le div d'achat de four ---------
	// ----------------------------------------------
	this.clickBuyFour = function () {
		if (money.sumBank >= fourControls.getPrix())
			fourControls.buyItem();
	}

	// -- Fonction se déclanchant quand l'utilisateur
	// -- clique sur le div d'achat de pizzeria -----
	// ----------------------------------------------
	this.clickBuyPizzeria = function () {
		if (money.sumBank >= pizzeriaControls.getPrix())
			pizzeriaControls.buyItem();
	}

	// -- Fonction se déclanchant quand l'utilisateur
	// -- clique sur le div d'achat d'usine ---------
	// ----------------------------------------------
	this.clickBuyUsine = function () {
		if (money.sumBank >= usineControls.getPrix())
			usineControls.buyItem();
	}

	// -- Fonction se déclanchant quand l'utilisateur
	// -- clique sur le div de vente de pizza -------
	// ----------------------------------------------
	this.clickSellPizza = function () {
		if (pizza.cptPizza >= sellControls.getPrix())
			sellControls.sellPizzas();
	}

	// -- Fonction se déclanchant quand l'utilisateur
	// -- clique sur le div de vente de pizzaBox ----
	// ----------------------------------------------
	this.clickSellPBox = function () {
		if (pizza.cptPizza >= sellBoxControls.getPrix())
			sellBoxControls.sellPizzas();
	}

	// -- Fonction se déclanchant quand l'utilisateur
	// -- clique sur le div de vente de voiture -----
	// ----------------------------------------------
	this.clickSellCar = function () {
		if (pizza.cptPizza >= sellCarControls.getPrix())
			sellCarControls.sellPizzas();
	}

	// -- Fonction se déclanchant quand l'utilisateur
	// -- clique sur le div de vente de camion ------
	// ----------------------------------------------
	this.clickSellTruck = function () {
		if (pizza.cptPizza >= sellTruckControls.getPrix())
			sellTruckControls.sellPizzas();
	}
}