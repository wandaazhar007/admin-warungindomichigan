import styles from './SkeletonLoader.module.scss';

interface SkeletonLoaderProps {
  rows?: number;
}

const SkeletonLoader = ({ rows = 5 }: SkeletonLoaderProps) => {
  return (
    <tbody>
      {[...Array(rows)].map((_, index) => (
        <tr key={index} className={styles.skeletonRow}>
          <td><div className={styles.skeletonCell} style={{ width: '250px' }}></div></td>
          <td><div className={styles.skeletonCell} style={{ width: '80px' }}></div></td>
          <td><div className={styles.skeletonCell} style={{ width: '120px' }}></div></td>
          <td><div className={styles.skeletonCell} style={{ width: '100px' }}></div></td>
        </tr>
      ))}
    </tbody>
  );
};

export default SkeletonLoader;