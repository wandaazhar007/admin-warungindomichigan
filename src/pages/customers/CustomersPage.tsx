import { useState, useEffect } from 'react';
import { getCustomers } from '../../services/customerService';
import type { Customer } from '../../types/customer';
import styles from './CustomersPage.module.scss';
import Avatar from '../../components/avatar/Avatar';

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await getCustomers();
        setCustomers(data);
        setError(null);
      } catch (err) {
        setError("Failed to load customers. You may not have the required permissions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className={styles.customersPage}>
      <header className={styles.header}>
        <h1>Customers</h1>
        {/* We can add search or filter actions here later */}
      </header>
      <div className={styles.tableContainer}>
        {loading && <p>Loading customers...</p>}
        {error && <p className={styles.errorText}>{error}</p>}
        {!loading && !error && (
          <table className={styles.customersTable}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Joined Date</th>
                <th>Last Signed In</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.uid}>
                  <td>
                    <div className={styles.customerCell}>
                      <Avatar
                        src={customer.photoURL}
                        name={customer.displayName}
                      />
                      <span>{customer.displayName || 'No Name Provided'}</span>
                    </div>
                  </td>
                  <td>{customer.email}</td>
                  <td>{new Date(customer.creationTime).toLocaleDateString()}</td>
                  <td>{new Date(customer.lastSignInTime).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;