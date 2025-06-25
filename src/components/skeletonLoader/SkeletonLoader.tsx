import styles from './SkeletonLoader.module.scss';

// Define a type for the column configuration
interface ColumnConfig {
  width: string;
}

interface SkeletonLoaderProps {
  rows?: number;
  columns: ColumnConfig[]; // Accept an array of column configs
}

const SkeletonLoader = ({ rows = 5, columns }: SkeletonLoaderProps) => {
  return (
    <tbody>
      {[...Array(rows)].map((_, rowIndex) => (
        <tr key={rowIndex} className={styles.skeletonRow}>
          {columns.map((column, colIndex) => (
            <td key={colIndex}>
              <div className={styles.skeletonCell} style={{ width: column.width }}></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default SkeletonLoader;