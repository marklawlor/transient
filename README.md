# Transient

> This is more a proof of concept and needs more Real World testing

Transient is a library to help manage short-lived transient effects due to state updates. A transient effect is a short lived event that is coupled to a user defined action. For example, making a button bounce when click, or playing a sound effect. Transient effects are often implement as side-effects, which can be an anti-pattern for state managerment, are a useful pattern in seperating your business/state logic from your ui transient effects.

## The pitch

You are a developer for an an online store. When a user clicks "Add Item to Cart", the state is updated with the new item; but also the button which was clicked does a bounce animation and the shopping cart button should also shake.

Traditionally, each button would wrap the `addToCart` handler to trigger their animation and the shopping cart button would respond to the state being updated. This implementation has a logic disconnection - its not clear that the shopping cart button should only animate when `addToCart` is called. What happens if the cart is updated from another function? You can "fix" this by adding more information to your state (eg a new action type) or wrap yoru `addToCart` function again!

Transient flips this mental modal around - these effects should be trackable via the function that was invoked, not the state update it performed. When `addToCart` is called, the shopping card button should update and each button should intelligently only animate when their version `addToCart` to called.

## Usage

### React

```tsx
function MyComponent() {
  const store = useMyStateLibrary()

  const update = useTransient(store.updateState)

  useTriggerCallback(update, () => {
    // Will be called whenever update is called
    // from either child
  })

  return (
    <>
      <MyButton update={update} />
      <MyButton update={update} />
    <>
  )
}

function MyButton({ update: parentUpdate }) {
  const update = parentUpdate.useChild()

  useTriggerCallback(parentUpdate, () => {
    // Will be called whenever update is called
    // from any MyButton
  })

  useTriggerCallback(update, () => {
    // Will be called whenever localUpdate is called
    // only from only this MyButton
  })

  return <button onClick={() => update({ ... })} />
}
```
