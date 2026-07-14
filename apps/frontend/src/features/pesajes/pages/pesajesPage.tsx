import { usePesajes } from "../hooks/usePesajes";
import { PesajesList } from "../components/PesajesList";

const PesajesPage = () => {
  const {
    data,
    query,
    setQuery,
    loading,
    error,
    setPage,
    deletingId,
    deletePesajeItem,
    downloadingExcel,
    downloadingPdf,
    exportDialog,
    openExportDialog,
    closeExportDialog,
    confirmExport,
  } = usePesajes();
 
  return (
    <PesajesList
      data={data}
      query={query}
      setQuery={setQuery}
      loading={loading}
      error={error}
      setPage={setPage}
      deletingId={deletingId}
      deletePesajeItem={deletePesajeItem}
      downloadingExcel={downloadingExcel}
      downloadingPdf={downloadingPdf}
      exportDialog={exportDialog}
      openExportDialog={openExportDialog}
      closeExportDialog={closeExportDialog}
      confirmExport={confirmExport}
    />
  );
};

export default PesajesPage;
