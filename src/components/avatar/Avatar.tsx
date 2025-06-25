import styles from './Avatar.module.scss';

interface AvatarProps {
  src?: string | null;
  name?: string | null;
}

// This function is now more robust for handling missing names
const getInitials = (name: string): string => {
  // If the name is empty or just whitespace, return a placeholder
  if (!name.trim()) return '?';

  const words = name.trim().split(' ').filter(word => word); // Filter out empty strings

  if (words.length === 0) return '?';

  // If there's more than one word, use the first letter of the first and last words
  if (words.length > 1) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  // For a single word, return the first two letters
  return words[0].substring(0, 2).toUpperCase();
};

const Avatar = ({ src, name }: AvatarProps) => {
  if (src) {
    return <img src={src} alt={name ?? 'User Avatar'} className={styles.avatarImage} />;
  }

  // Pass an empty string as the fallback instead of "User"
  const initials = getInitials(name ?? '');

  return (
    <div className={styles.initialsAvatar}>
      <span>{initials}</span>
    </div>
  );
};

export default Avatar;