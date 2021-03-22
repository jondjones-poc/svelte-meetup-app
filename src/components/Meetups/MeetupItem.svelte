
<script>
    import { createEventDispatcher } from 'svelte';
    import Button from '../../components/UI/Button.svelte';
    import Badge from '../../components/UI/Badge.svelte';
    import meetups from '../../store/meetup-store'

    const dispatch = createEventDispatcher();

    export let id;
    export let title;
    export let subTitle;
    export let imageUrl;
    export let description;
    export let address;
    export let isFavourite;

    let isLoading = false;

    function toogleFavourite() {
      isLoading = true;
      fetch(`https://svelte-meetup-application-default-rtdb.firebaseio.com/meetups/${id}.json`, {
          method: 'PATCH',
          body: JSON.stringify({isFavourite: !isFavourite}),
          headers: {
              'Content-Type': 'application/json'
          }}
      ).then(result => {
          if (!result.ok) {
              throw new Error('Fail to favourite a meet-up data');
          }
          isLoading = false;  
          meetups.toogleFavourite(id)
      }).catch(error => {
          console.log(error);
          isLoading = false;  
      });
    }
</script>
<style>
     article {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 5px;
    background: white;
    margin: 1rem;
  }

  header,
  .content,
  footer {
    padding: 1rem;
  }

  .image {
    width: 100%;
    height: 14rem;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  h1 {
    font-size: 1.25rem;
    margin: 0.5rem 0;
    font-family: "Roboto Slab", sans-serif;
  }

  h2 {
    font-size: 1rem;
    color: #808080;
    margin: 0.5rem 0;
  }

  p {
    font-size: 1.25rem;
    margin: 0;
  }

  div {
    text-align: right;
  }

  .content {
    height: 4rem;
  }
</style>

<article>
    <header>
        <h1>
          {title}
          {#if isFavourite}
            <Badge>Favourite</Badge>
          {/if}
        </h1>
        <h2>{subTitle}</h2>
        <p>{address}</p>
        <div class="image">
            <img src={imageUrl} alt={title}></div>
        <div class="content">
            <p>
                {description}
            </p>
        </div>
        <footer>
            <Button mode="outline" on:click={() => dispatch('edit', id)}>
              Edit
            </Button>
            {#if isLoading}
              <span>Changing...</span>
            {:else}
              <Button 
                type="button" 
                cssClass="outline" 
                on:click={toogleFavourite}
                color={!isFavourite ? null : 'success'}>
                {isFavourite ? 'Forget' : 'Favourite'} 
              </Button>
            {/if}
            <Button href={`/${id}`}>
              Show Details
            </Button>    
        </footer>
    </header>
</article>