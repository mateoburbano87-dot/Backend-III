import fs from 'fs/promises';

// Elimino un archivo del disco si algo falla después de subirlo
// (por ejemplo, si la entidad no existe o falla la base de datos)
export const deleteFileIfExists = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // Si el archivo no existe, no me importa. Solo loggeo otros errores.
    if (error.code !== 'ENOENT') {
      console.error('Error al eliminar archivo:', error.message);
    }
  }
};