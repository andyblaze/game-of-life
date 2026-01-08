export default class GameEngine {
  constructor(config) {
    this.state = config.initialState;
    this.states = config.states;
    this.transitions = config.transitions;
    this.context = config.context || {};

    this.listeners = {};
  }

  /* -----------------------------
     Event system (lightweight)
     ----------------------------- */

  on(eventName, handler) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(handler);
  }

  emit(eventName, payload) {
    console.log(eventName, payload);
    const handlers = this.listeners[eventName] || [];
    handlers.forEach(fn => fn(payload));
  }

  /* -----------------------------
     State machine core
     ----------------------------- */

  dispatch(eventName, payload) {
    const stateTransitions = this.transitions[this.state];
    if (!stateTransitions) {
      console.warn(`No transitions defined for state: ${this.state}`);
      return;
    }

    const transition = stateTransitions[eventName];
    if (!transition) {
      // Illegal or irrelevant event for this state
      this.emit("event:ignored", {
        state: this.state,
        event: eventName
      });
      return;
    }

    const fromState = this.state;
    const toState = transition.to;

    // Exit hook
    this.emit(`state:exit:${fromState}`, payload);

    // Transition action
    if (typeof transition.action === "function") {
      transition.action(this.context, payload);
    }

    // State change
    this.state = toState;
    this.emit("state:change", { from: fromState, to: toState });

    // Enter hook
    this.emit(`state:enter:${toState}`, payload);
  }

  /* -----------------------------
     Introspection helpers
     ----------------------------- */

  getState() {
    return this.state;
  }

  /*can(eventName) {
    const stateTransitions = this.transitions[this.state];
    return !!(stateTransitions && stateTransitions[eventName]);
  }*/
can(eventName) {
  const stateTransitions = this.transitions[this.state];
  return Boolean(stateTransitions?.[eventName]);
}
}
