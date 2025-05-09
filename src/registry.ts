import { E2xRenderCellFunction } from './cell';
import { ISignal, Signal } from '@lumino/signaling';
import { Token } from '@lumino/coreutils';

export const ICellRegistry = new Token<ICellRegistry>(
  '@e2xgrader/cell-registry:ICellRegistry'
);

export interface ICellRegistry {
  registerCellType(
    cellType: string,
    label: string,
    renderCell: E2xRenderCellFunction
  ): void;
  cellRegistered: ISignal<
    this,
    { type: string; renderCell: E2xRenderCellFunction }
  >;
  getRenderCell(cellType: string): E2xRenderCellFunction | undefined;
  getCellTypes(): string[];
  getCellTypeLabel(cellType: string): string | undefined;
}

export class CellRegistry implements ICellRegistry {
  private cellLabels: { [key: string]: string } = {};
  private cellRenderers: { [key: string]: E2xRenderCellFunction } = {};
  private readonly _cellRegistered = new Signal<
    this,
    { type: string; renderCell: E2xRenderCellFunction }
  >(this);

  get cellRegistered(): ISignal<
    this,
    { type: string; renderCell: E2xRenderCellFunction }
  > {
    return this._cellRegistered;
  }

  registerCellType(
    cellType: string,
    label: string,
    renderCell: E2xRenderCellFunction
  ): void {
    if (this.cellLabels[cellType]) {
      throw new Error(`Cell type ${cellType} is already registered.`);
    }
    this.cellLabels[cellType] = label;
    this.cellRenderers[cellType] = renderCell;
    this._cellRegistered.emit({ type: cellType, renderCell });
  }

  getRenderCell(cellType: string): E2xRenderCellFunction | undefined {
    return this.cellRenderers[cellType];
  }

  getCellTypes(): string[] {
    return Object.keys(this.cellLabels);
  }

  getCellTypeLabel(cellType: string): string | undefined {
    return this.cellLabels[cellType];
  }
}
