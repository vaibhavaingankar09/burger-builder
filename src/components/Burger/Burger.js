import React from 'react';

import classes from './Burger.module.css';
import BurgerIngredients from './BurgerIngredient/BurgerIndegrients';

const burger = (props) => {
    let transformedIngredient = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])]
                .map((_, i) => {
                    return <BurgerIngredients key={igKey + i} type={igKey} />
                });
            })
            .reduce((arr, el) => {
                return arr.concat(el)
            }, []);
    if (transformedIngredient.length === 0) {
        transformedIngredient = <p>Please start adding ingredients!</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredients type="bread-top" />
            {transformedIngredient}
            <BurgerIngredients type="bread-bottom" />
        </div>
    )
};

export default burger;