import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControl from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/action';


class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        loading: false,
        error: null
    }

    componentDidMount() {
        console.log(this.props)
        // axios.get('https://react-my-burger-7d742.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({ ingredients: response.data });
        //     })
        //     .catch(error => {
        //         this.setState({ error: true });
        //     })
    }
    updatePurchaseState() {

        const sum = Object.keys(this.props.ings)
            .map(igKey => {
                return this.props.ings[igKey]
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0;
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    }
    render() {
        const disabledInfo = {
            ...this.props.ings
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let burger = this.state.error ? <p>Ingredients cannot be loaded.</p> : <Spinner />;
        let orderSummary = null;

        if (this.props.ings) {

            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControl
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        purchasable={this.updatePurchaseState()}
                        ordered={this.purchaseHandler}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary
                ingredients={this.props.ings}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.props.price} />;
        }



        if (this.state.loading) {
            orderSummary = <Spinner />;
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
        onIngredientRemoved: (ingName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));