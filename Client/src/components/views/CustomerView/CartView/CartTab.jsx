import React, { Component } from 'react'

import { Header, Item, Divider, Form, Grid, Button, Segment } from 'semantic-ui-react'
import CartItem from './CartItem';

import axios from 'axios';

import { LoginContext } from '../../../LoginContext';

class CartTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            promoCode: '',
            address: '',
            subtotal: 0,
            deliveryCost: 0,
            rname: (this.props.cartItems.length == 0) ? '' : this.props.cartItems[0].rname,
            descript: '',
            minOrder: 0,
            cartItems: this.props.cartItems.map(item => {
                return {
                    fname: item.fname,
                    price: item.price,
                    category: item.category,
                    rname: item.rname,
                    qty: 0,
                }
            })
        }
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
        this.incOrDecItem = this.incOrDecItem.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleGetPrice = this.handleGetPrice.bind(this);
        this.handleSubmitOrder = this.handleSubmitOrder.bind(this);
    }

    componentDidMount() {
        if (this.state.cartItems.length == 0) return;
        axios.get('/restaurant/api/get/gettherestaurantfromdb', { params: { rname: this.state.rname } }).then(res => {
            this.setState({
                minOrder: res.data[0].minorder,
                descript: res.data[0].descript
            });
        })
            .catch(err => console.log(err))
    }


    handleDeleteItem(item) {
        const fname = item.fname;
        this.setState(prevState => {
            return {
                cartItems: prevState.cartItems.filter(function (obj) {
                    return obj.fname !== fname;
                })
            }
        })

        this.props.handleDeleteItem(item);
    }

    incOrDecItem(item, op) {
        const name = item.fname;

        //increment/decrement here 
        this.setState(prevState => {
            return {
                cartItems: prevState.cartItems.map((item) => {
                    if (item.fname === name) {
                        if (!(op < 0 && item.qty === 0)) item.qty += op;
                    }
                    return item;
                })
            }
        }, () => console.log("called"))
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleGetPrice() {
        console.log(this.state);
        axios.get('/customer/api/get/getdeliverycost').then(res => {
            this.setState({
                deliveryCost: res.data[0].getdeliverycost,
            });

        })
            .catch(err => console.log(err))
    }

    handleSubmitOrder() {
        console.log(this.context);
        let cid = this.context.user.id;
        //let cid = 5;
        axios.post('/customer/api/posts/insertorder',
            { cid: cid, rname: this.state.rname, cartcost: this.state.subtotal, location: this.state.address })
            .then(res => alert("Order Placed"))
            .catch(err => console.log(err));
        //get orid from here ^
        let orid = 1;
        this.state.cartItems.map((item) =>
            axios.post('/customer/api/posts/insertorder',
                { orid: orid, fname: item.fname, quantity: item.qty })
                .then()
                .catch(err => console.log(err)
                ));
    }

    render() {
        let header = (this.state.cartItems.length == 0) ? <Header>There is nothing in your cart!</Header> :
            <Item.Group>
                <Item >
                    <Item.Content verticalAlign='middle'>
                        <Item.Header style={{ fontSize: '50px' }} as='h1'>{this.state.rname}</Item.Header>
                        <Item.Meta>{this.state.descript}</Item.Meta>
                        <Item.Description>Min Order: ${this.state.minOrder}</Item.Description>
                    </Item.Content>
                </Item>
            </Item.Group>
        return (
            <>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column textAlign='left' width={16}>
                            {header}
                            <Divider />
                            <Form>
                                <CartItem updateItem={this.incOrDecItem} handleDeleteItem={this.handleDeleteItem} menuItems={this.state.cartItems}></CartItem>
                                <Segment>
                                    <Form.Field>
                                        <label>Please key in your address</label>
                                        <input name='address' type='text' onChange={this.handleChange} placeholder='Address' />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Promo Code</label>
                                        <input name='promoCode' onChange={this.handleChange} placeholder='$$' />
                                    </Form.Field>
                                </Segment>
                                <Button fluid color='blue' onClick={this.handleGetPrice} type='submit'>Get Price</Button>
                                <Segment>
                                    <Segment basic>
                                        <text>Subtotal:</text>
                                        <text style={{ float: 'right' }}>${this.state.subtotal}</text>
                                    </Segment>
                                    <Segment basic>
                                        <text>Delivery:</text>
                                        <text style={{ float: 'right' }}>${this.state.deliveryCost}</text>
                                    </Segment>

                                    <Segment basic>
                                        <text>Total:</text>
                                        <text style={{ float: 'right' }}>${this.state.deliveryCost + this.state.subtotal}</text>
                                    </Segment>

                                    {/* promo code? */}
                                </Segment>
                                <Button floated='right' fluid color='blue' onClick={this.handleSubmitOrder}>Place Order</Button>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </>
        )
    }

}

CartTab.contextType = LoginContext;


export default CartTab;