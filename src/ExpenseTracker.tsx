import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

interface Expense {
    id: number;
    amount: number;
    date: string;
    category: string;
    description?: string;
}

const ExpenseTracker: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [formState, setFormState] = useState<Expense>({
        id: 0,
        amount: 0,
        date: "",
        category: "",
        description: "",
    });

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await fetch("http://adres-twojego-backendu/api/expenses");
            const data = await response.json();
            setExpenses(data);
        } catch (error) {
            console.error("Wystąpił błąd podczas pobierania wydatków:", error);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch("http://adres-twojego-backendu/api/expenses", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(formState),
            });
            if (response.ok) {
                setFormState({
                    id: 0,
                    amount: 0,
                    date: "",
                    category: "",
                    description: "",
                });
                fetchExpenses();
            } else {
                console.error("Nie udało się dodać wydatku.");
            }
        } catch (error) {
            console.error("Wystąpił błąd podczas dodawania wydatku:", error);
        }
    };

    return (
        <Tabs>
            <TabList>
                <Tab>Podgląd wydatków</Tab>
                <Tab>Dodaj nowy wydatek</Tab>
            </TabList>

            <TabPanel>
            </TabPanel>
            <TabPanel>
                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        value={formState.amount}
                        name="amount"
                        placeholder="Kwota"
                        onChange={handleChange}
                    />
                    <input
                        type="date"
                        value={formState.date}
                        name="date"
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        value={formState.category}
                        name="category"
                        placeholder="Kategoria"
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        value={formState.description}
                        name="description"
                        placeholder="Opis"
                        onChange={handleChange}
                    />
                    <button type="submit">Dodaj</button>
                </form>
            </TabPanel>
        </Tabs>
    );
};

export default ExpenseTracker;
