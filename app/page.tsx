import CardClock from "./components/CardClock/CardClock";
import styles from './page.module.css';

export default function Home() {
    return (
        <main>
            <div className={styles.widgetRow}>
                <div className={styles.widget}><CardClock /></div>
            </div>
        </main>
    );
}
