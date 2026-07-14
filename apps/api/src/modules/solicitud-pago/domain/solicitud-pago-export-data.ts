export type SolicitudPagoExportData = {
  id: string;
  pesajes: {
    createdAt: Date;
    recuperador: {
      name: string;
      lastName: string;
      dni: string | null;
      cuil: string | null;
    };
    items: {
      material: {
        name: string;
      };
      weight: number;
    }[];
  }[];
};
