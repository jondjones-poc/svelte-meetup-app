<script>
    export let controlType = null;
    export let id;
    export let label;
    export let rows = null;
    export let value = null;
    export let type = 'text'
    export let valid = true;
    export let errorMessage = '';

    let touched = false;
</script>

<style>
  input,
  textarea {
    display: block;
    width: 100%;
    font: inherit;
    border: none;
    border-bottom: 2px solid #ccc;
    border-radius: 3px 3px 0 0;
    background: white;
    padding: 0.15rem 0.25rem;
    transition: border-color 0.1s ease-out;
  }

  input:focus,
  textarea:focus {
    border-color: #e40763;
    outline: none;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    width: 100%;
  }

  .form-control {
    padding: 0.5rem 0;
    width: 100%;
    margin: 0.25rem 0;
  }

  .error {
    border-color: red;
    background-color: #fde3e3;
  }

  .error-message {
    color: #e40763;
    margin: 0.25rem 0;
  }
</style>
<div class="form-control">
    <label for="{id}">
        {label}
    </label>
    {#if controlType === 'textarea'}
        <textarea
            {id}
            {rows}
            class:error={!valid && touched}
            bind:value
            on:blur={() => touched = true} />
    {:else}
        <input
            type={type}
            {id}
            {value}
            class:error={!valid && touched}
            on:input
            on:blur={() => touched = true}  />
    {/if}
    {#if errorMessage && !valid && touched}
      <p class="error-message">
        {errorMessage}
      </p>
    {/if}
</div>