# Transient

> This is more a proof of concept and needs more Real World testing

Transient is a library to help manage transient effects (aka side effects) due to state updates. Side effects for state management are an anti-pattern, but they are useful for effect management. Typically this is used to invoke animations, but there are other use-cases as well.

Transient also provides utilties

## The pitch

You are a developer for an an online store. When a user clicks "Add Item to Cart", the state is updated with the new item; but also the button which was clicked does a bounce animation and the shopping cart button should also shake.

Traditionally, each button would wrap the `addToCart` handler to trigger their animation and the shopping cart button would respond to the state being updated. This implementation has a logic disconnect, its not clear that the shopping cart button should only animate when `addToCart` is called. What happens if the cart is updated from another function?

Transient flips the mental modal around - these effects should be trackable via the function that was invoked, not the state update it performed. When `addToCart` is called, the shopping card button should update and each button should intelligently only animate when their version `addToCart` to called.

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

function MyButton({ update }) {
  const localUpdate = update.useChild()

  useTriggerCallback(update, () => {
    // Will be called whenever update is called
    // from either child
  })

  useTriggerCallback(localUpdate () => {
    // Will be called whenever localUpdate is called
    // only from this child
  })

  return <button onClick={() => localUpdate({ ... })} />
}
```
