import React, { useCallback, useEffect, useState } from 'react'
import './Dashboard.css'
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuthServices from '../../Services/AuthServices';
import API_ENDPOINT from '../../EndPoint';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAppleAlt } from '@fortawesome/free-solid-svg-icons'; // This can represent food/diet.
import { useDispatch, useSelector } from 'react-redux';
import { setShowForm } from '../../features/inputValue/Inputvalue';
import { FormControl, Select, MenuItem } from '@mui/material';
const Dashboard = () => {

    const user = useSelector(state => state.app.StoreUserData);
    const [imageDetails, setImageDetails] = useState([]);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true); // New loading state


    const containerVariants = {
        hidden: { opacity: 0, scale: 0.7 },
        show: {
            opacity: 1,
            scale: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.2, // Adding a delay before starting child animations
                type: 'spring', // Using spring motion
                stiffness: 80,
                damping: 20
            }
        }
    };
    

    const cardVariants = {
        hidden: { opacity: 0, transform: 'perspective(600px) rotateX(90deg)', transformOrigin: 'bottom' },
        show: {
            opacity: 1,
            transform: 'perspective(600px) rotateX(0deg)',
            transition: {
                duration: 1, // Duration increased to clearly see the flip effect
                ease: [0.68, -0.55, 0.265, 1.55], // Custom bezier curve for a bounce effect
            }
        }
    };
    
    

    useEffect(() => {
        // const user = AuthServices.GetCurrentUser()
        if (!user) {
            navigate("/login");
        }
        const body = { userId: user._id }
        async function fetchData() {
            try {
                const response = await fetch(`${API_ENDPOINT}/users/getImageDetails`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });

                const data = await response.json();
                if (data.success) {
                    setImageDetails(data.data);
                }
            } catch (error) {
                console.error("Error fetching image details:", error);
            } finally {
                setLoading(false); // set loading to false once data fetch is completed, whether successful or not
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        // const user = AuthServices.GetCurrentUser()
        if (!user) {
            navigate("/login");
        }
    });


    const foods = [
        {
            img: "pexels-photo-934055.webp",
            foodItems: [
                { name: "Macarons", calories: 28.34 },
                { name: "Pizza Slice", calories: 240 },
                { name: "Boiled Egg", calories: 68 },
                { name: "Apple", calories: 95 }
            ]
        },
        {
            img: "111.jpg",
            foodItems: [
                { name: "Banana", calories: 105 },
                { name: "Burger", calories: 354 },
                { name: "Salad", calories: 150 },
                { name: "Muffin", calories: 265 }
            ]
        },
        {
            img: "5.webp",
            foodItems: [
                { name: "Yogurt", calories: 59 },
                { name: "Pasta", calories: 131 },
                { name: "Chicken", calories: 335 },
                { name: "Pancakes", calories: 90 }
            ]
        },
        {
            img: "backgroundimge.jpg",
            foodItems: [
                { name: "Waffles", calories: 82 },
                { name: "Sandwich", calories: 289 },
                { name: "Fish Grilled", calories: 232 },
                { name: "Orange", calories: 62 }
            ]
        },
        {
            img: "orange.jpg",
            foodItems: [
                { name: "Strawberries", calories: 32 },
                { name: "Cheese", calories: 112 },
                { name: "Rice", calories: 130 },
                { name: "Milkshake", calories: 220 }
            ]
        },
        {
            img: "111.jpg",
            foodItems: [
                { name: "Cheesecake", calories: 257 },
                { name: "Ice Cream", calories: 137 },
                { name: "Juice", calories: 95 },
                { name: "Steak", calories: 271 }
            ]
        },
        {
            img: "newImage.jpg",
            foodItems: [
                { name: "Soda", calories: 150 },
                { name: "Lamb", calories: 294 },
                { name: "Popcorn", calories: 31 },
                { name: "Sushi", calories: 40 }
            ]
        },
        {
            img: "newImage1.jpg",
            foodItems: [
                { name: "Omelette", calories: 154 },
                { name: "Chips", calories: 152 },
                { name: "Soup", calories: 60 },
                { name: "Donut", calories: 195 }
            ]
        }
    ];
    const HandleDrop = () => {

        dispatch(setShowForm(false))
    }

    const [filter, setFilter] = useState('all');
    const [filteredCards, setFilteredCards] = useState([]);
    const [ranges, setRanges] = useState([]);

    useEffect(() => {
        const calorieValues = imageDetails.map(detail => {
            const value = parseFloat(detail.result.quantity);
            if (isNaN(value)) {
                console.warn("Invalid value detected:", detail.result.quantity);
                return 0;  // Default value
            }
            return value;
        });

        const validValues = calorieValues.filter(value => !isNaN(value));

        const minCal = Math.min(...validValues);
        const maxCal = Math.max(...validValues);
        if (minCal === maxCal) {
            setRanges([[minCal, maxCal + 1]]);
            return;
        }
        const segmentCount = Math.min(validValues.length, 4);
        const interval = (maxCal - minCal) / segmentCount;
        const calculatedRanges = [];
        for (let i = 0; i < segmentCount; i++) {
            calculatedRanges.push([minCal + i * interval, minCal + (i + 1) * interval]);
        }
        setRanges(calculatedRanges);
    }, [imageDetails]);

    useEffect(() => {
        if (filter === 'all') {
            setFilteredCards(imageDetails);
        } else if (filter.includes('-')) {
            const [min, max] = filter.split('-').map(value => parseFloat(value));
            setFilteredCards(imageDetails.filter(card => {
                const cardValue = parseFloat(card.result.quantity);
                if (isNaN(cardValue)) return false;  // Ignore this entry if it's not a valid number
                return cardValue >= min && cardValue <= max;

            }));
        }
    }, [filter, imageDetails]);

    const [selectedMonth, setSelectedMonth] = useState(-1); // -1 means all months
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        let cards = [...imageDetails];
        if (filter !== 'all') {
            const [min, max] = filter.split('-').map(value => parseFloat(value));
            cards = cards.filter(card => {
                const cardValue = parseFloat(card.result.quantity);
                return !isNaN(cardValue) && cardValue >= min && cardValue <= max;
            });
        }
        if (selectedMonth !== -1) {
            cards = cards.filter(card => {
                const cardDate = new Date(card.createdAt);
                return cardDate.getMonth() === parseInt(selectedMonth);
            });
        }
        setFilteredCards(cards);
    }, [filter, selectedMonth, imageDetails]);


    const [hasInitialCards, setHasInitialCards] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const body = { userId: user._id }
                const response = await fetch(`${API_ENDPOINT}/users/getImageDetails`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });

                const data = await response.json();
                if (data.success) {
                    setImageDetails(data.data);

                    // Check if there are initial cards and set the state
                    if (data.data.length > 0) {
                        setHasInitialCards(true);
                    }
                } else {
                    console.warn("No success from server:", data.message);
                }
            } catch (error) {
                console.error("Error fetching image details:", error);
            } finally {
                setLoading(false); // set loading to false once data fetch is completed, whether successful or not
            }
        }

        fetchData();
    }, [user]); // I added 'user' dependency because inside useEffect we are using 'user' to fetch data.



    const [selectedFood, setSelectedFood] = useState('');


    const foodItems = imageDetails.map(detail => detail.result.food);
    const uniqueFoodItems = [...new Set(foodItems)];

    useEffect(() => {
        let cards = [...imageDetails];

        // Filter by calorie value
        if (filter !== 'all') {
            const [min, max] = filter.split('-').map(value => parseFloat(value));
            cards = cards.filter(card => {
                const cardValue = parseFloat(card.result.quantity);
                return !isNaN(cardValue) && cardValue >= min && cardValue <= max;
            });
        }

        // Filter by month
        if (selectedMonth !== -1) {
            cards = cards.filter(card => {
                const cardDate = new Date(card.createdAt);
                return cardDate.getMonth() === parseInt(selectedMonth);
            });
        }

        // Filter by food
        if (selectedFood) {
            cards = cards.filter(card => card.result.food === selectedFood);
        }

        setFilteredCards(cards);
    }, [filter, selectedMonth, imageDetails, selectedFood]);


    return (
        <div className='DashboardPageContainer' onClick={HandleDrop}>
            <div className="innerdivResultDashboard">
                <h1 className='RecentPara'>recent activity</h1>
                {
                    (hasInitialCards || filter !== 'all' || selectedMonth !== -1) && (
                        <>

                            {/* <div className="dropdownParas">
                                <p className='dropdownPara'>Filter by Caloric</p>
                                <p className='dropdownPara'>Filter by Month</p>
                                <p className='dropdownPara'>Filter by Food</p>
                            </div> */}
                            <div className="dropDown">

                                {/* Food Dropdown */}
                                <FormControl style={{ width: '100%' }}>
                                    <p className='dropdownPara'>Filter by Food</p>
                                    <Select
                                        value={selectedFood}
                                        onChange={e => setSelectedFood(e.target.value)}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Filter by food' }}
                                    >
                                        <MenuItem className="customMenuItem" value="">All Foods</MenuItem>
                                        {
                                            uniqueFoodItems.map((food, index) => (
                                                <MenuItem className="customMenuItem" key={index} value={food}>{food}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>

                                {/* Month dropdown */}
                                <FormControl style={{ width: '100%' }}>
                                    <p className='dropdownPara'>Filter by Month</p>
                                    <Select
                                        value={selectedMonth}
                                        onChange={e => setSelectedMonth(parseInt(e.target.value, 10))}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        <MenuItem className="customMenuItem" value={-1}>All Months</MenuItem>
                                        {
                                            months.map((month, index) => (
                                                <MenuItem className="customMenuItem" key={index} value={index}>{month}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>




                                <FormControl style={{ width: '100%' }}>
                                    <p className='dropdownPara'>Filter by Caloric</p>
                                    <Select
                                        value={filter}
                                        onChange={e => setFilter(e.target.value)}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        <MenuItem className="customMenuItem" value="all">All</MenuItem>
                                        {
                                            ranges.map((range, index) => (
                                                <MenuItem className="customMenuItem" key={index} value={`${range[0]}-${range[1]}`}>
                                                    {`${range[0].toFixed(2)} to ${range[1].toFixed(2)}`}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>

                            </div>
                        </>

                    )
                }
                <hr />
                <div className="recentDivBox">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="recentCardBoxDiv"
                    >
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                        ) : filteredCards.length > 0 ? (
                            filteredCards.map((card, cardIndex) => (
                                <motion.div key={cardIndex} variants={cardVariants} className="cloriesCard">
                                    <img src={card.imageUrl} alt="Food items" />
                                    <span className="imageChip">
                                        {card.result.food.charAt(0).toUpperCase() + card.result.food.slice(1)}
                                    </span>
                                    <div className="food-listRecent">
                                        <div className='food-itemRecent'>
                                            <span className='food-nameRecent'>
                                                {card.result.food.charAt(0).toUpperCase() + card.result.food.slice(1)}
                                                <img src="cutlery.png" alt="" />
                                            </span>
                                            <span className='calorie-infoRecent food-nameRecent'>
                                                <p>Calories: {card.result.quantity}</p>
                                                <img src="caloriesIcon.png" alt="" />
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p>No data available at the moment.</p>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard