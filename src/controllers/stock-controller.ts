import { Request, Response } from "express";
import StockModel from "../models/stock-model";

abstract class StockController {
	static stock: Record<string, any> = {
		calzas: {
		  lisa: [],
		  estampada: [],
		},
		remeras: {
		  lisa: [],
		  estampada: [],
		  remerón: [],
		},
		joggins: {
		  invierno: [],
		  verano: [],
		},
		shorts: {
		  liso: [],
		  estampado: [],
		  algodon: [],
		},
		camperas: {
		  invierno: [],
		  verano: [],
		},
	};

	static getStock(req: Request, res: Response) {
		const stock = StockModel.getStock();
		res.json(stock);
	};

	static getHombre(req: Request, res: Response) {
		const hombre = StockModel.getHombre();
		res.json(hombre);
	};

	static getDama(req: Request, res: Response) {
		const dama = StockModel.getDama();
		res.json(dama);
	};

    static getId(req: Request, res: Response) {
		const { id } = req.params;
		const stockFound = StockModel.getId(id);

		if (!stockFound)
			return res.status(404).json({ message: 'Lote inexistente! ID desconocido.' });

		res.status(200).json(stockFound);
	};

	static getCategory(req: Request, res: Response) {
		const { category } = req.params;
		const categoryFound = StockController.stock[category];
	
		if (!categoryFound) {
		  return res.status(404).json({ error: 'Categoría no encontrada.' });
		}
	
		res.json(categoryFound);
	};

	static getPrecio(req: Request, res: Response) {
		const { precio } = req.params;
		const stockFound = StockModel.getPrecio(precio);

		if (!stockFound)
			return res.status(404).json({ message: 'Lote inexistente! Precio desconocido.' });

		res.status(200).json(stockFound);
	};

	static create(req: Request, res: Response) {
		const { categoria, subcategoria } = req.params;
		const { descripcion, color, talle, disponibilidad, precio } = req.body;

		if (!StockController.stock[categoria]) {
		  res.status(400).json({ error: 'Categoría no válida' });
		  return;
		}
	
		if (!StockController.stock[categoria][subcategoria]) {
		  res.status(400).json({ error: 'Subcategoría no válida' });
		  return;
		}
	
		const nuevoElemento = {
		  id: 'randomUUID',
		  descripcion,
		  color,
		  talle,
		  disponibilidad,
		  precio,
		};
	
		StockController.stock[categoria][subcategoria].push(nuevoElemento);
	
		res.json(nuevoElemento);
	};

	static update(req: Request, res: Response) {
	    const { categoria, subcategoria } = req.params;
   		const { id, description, color, talle, disponibilidad, precio } = req.body;

    	if (!StockController.stock[categoria]) {
      		res.status(400).json({ error: 'Categoría no válida' });
      		return;
    	}

    	if (!StockController.stock[categoria][subcategoria]) {
      		res.status(400).json({ error: 'Subcategoría no válida' });
      		return;
    	}

    	const elementoIndex = StockController.stock[categoria][subcategoria].findIndex((producto: any) => producto.id === id);

   		if (elementoIndex === -1) {
      		res.status(404).json({ error: 'Producto no encontrado' });
      		return;
    	}

    	StockController.stock[categoria][subcategoria][elementoIndex] = {
      		id,
      		description,
      		color,
      		talle,
      		disponibilidad,
      		precio,
    	};

    	res.json(StockController.stock[categoria][subcategoria][elementoIndex]);
	};

	static delete(req: Request, res: Response) {
		const { categoria, subcategoria } = req.params;
		const { id } = req.body;
	
		if (!StockController.stock[categoria]) {
		  res.status(400).json({ error: 'Categoría no válida' });
		  return;
		}
	
		if (!StockController.stock[categoria][subcategoria]) {
		  res.status(400).json({ error: 'Subcategoría no válida' });
		  return;
		}
	
		const elementoIndex = StockController.stock[categoria][subcategoria].findIndex(
		  (producto: any) => producto.id === id
		);
	
		if (elementoIndex === -1) {
		  res.status(404).json({ error: 'Producto no encontrado' });
		  return;
		}
	
		const elementoEliminado = StockController.stock[categoria][subcategoria].splice(elementoIndex, 1);
	
		res.json({ message: 'Producto eliminado correctamente', elemento: elementoEliminado });
	};

	static error(req: Request, res: Response) {
		res.status(404).json({ message: 'URL solicitada no encontrada.' });
	};
};

export default StockController;