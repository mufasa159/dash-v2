import CardClock from "../components/CardClock/CardClock";
import CardNews from "../components/CardNews/CardNews";
import CardQuote from "../components/CardQuote/CardQuote";
import CardToDo from "../components/CardToDo/CardToDo";
import CardSpotify from "../components/CardSpotify/CardSpotify";
import CardSignIn from "../components/CardSignIn/CardSignIn";
import CardHabits from "../components/CardHabits/CardHabits";
import styles from './page.module.css';
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";


export default async function Home() {
    const session = await getServerSession(authOptions);

    return (
        <main>
            <div className={styles.widgetRow}>
                <div className={styles.widget}><CardClock /></div>
                <div className={styles.widget}><CardNews /></div>
                <div className={styles.widget}><CardQuote /></div>
                <div className={styles.widget}><CardToDo /></div>
                {!session ? (
                    <div className={styles.widget}><CardSignIn /></div>
                ) : (
                    <div className={styles.widget}><CardSpotify /></div>
                )}
                <div className={styles.widget}><CardHabits /></div>
            </div>
        </main>
    );
}
