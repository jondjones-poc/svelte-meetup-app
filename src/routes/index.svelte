<script context="module">
  export function preload(page) {
    return this.fetch('https://svelte-meetup-application-default-rtdb.firebaseio.com/meetups.json')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Fail to get data');
              }
              return response.json();
          })
          .then(data => {
            const loadedMeetups = [];
            for (const key in data) {
              loadedMeetups.push({
                ...data[key],
                id: key
              });
            }
            return { fetchedmeetups: loadedMeetups.reverse() };
          }).catch(error => {
              console.log(error);
              this.error(500, "Could Not Fetch Meetups");
      });
  }
</script>

<script>
    import { onMount, onDestroy} from 'svelte';
    import {scale} from 'svelte/transition';
    import {flip} from 'svelte/animate';

    import store from '../store/meetup-store';

    import MeetupItem from "../components/Meetups/MeetupItem.svelte";
    import MeetupFilter from '../components/Meetups/MeetupFilter.svelte'
    import EditMeetup from '../components/Meetups/EditMeetup.svelte'
    import Button from '../components/UI/Button.svelte';
    import Spinner from '../components/UI/Spinner.svelte'

    export let fetchedmeetups;
    
    let loadedMeetups = [];
    let editMode = false;
    let editedId = null;
    let isLoading = false;
    let unsubscribe = null;

    $: filteredMeetups = favouriteMode 
      ? fetchedmeetups.filter(item => item.isFavourite === favouriteMode)
      : fetchedmeetups;

    let favouriteMode = false;

    onMount(() => {
      store.setMeetups(fetchedmeetups);
      unsubscribe = store.subscribe(items => {
        loadedMeetups = items
      });
    });

    onDestroy(() => {

      if (unsubscribe) {
        unsubscribe();
      }

    });

    function setFilter(event) {
      favouriteMode = event.detail === 1
    }

    function saveMeetup() {
      editMode = false;
      editedId = null;
    }

    function closeModel() {
      editMode = null;
      editedId = null;
    }

    function setEditMode(event) {
      editMode = true;
      editedId = event.detail;
    }

    function setAddMode(event) {
      editMode = true;
    }
</script>

<style>
  section {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  @media (min-width: 768px) {
    section {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  #meetup-controls {
    display: flex;
    justify-content: space-between;
  }

  .no-meetups {
    margin: 5rem 1rem;
  }
</style>

<svelte:head>
	<title>Meet-Up App</title>
</svelte:head>

{#if editMode}
  <EditMeetup id={editedId} on:save={saveMeetup} on:cancel={closeModel} />
{/if}

{#if isLoading}
  <Spinner />
{:else}

  <section id="meetup-controls">

      <MeetupFilter on:select={setFilter}/>
      <Button on:click={setAddMode}>
        New Meetup
      </Button>

  </section>

  {#if !filteredMeetups || filteredMeetups.length === 0}
    <p class="no-meetups">
      No meetups found, you can add some via the UI 
    </p>
  {/if}

  <section id="meetups">
      {#each filteredMeetups as meetup (meetup.id)}
        <div transition:scale animate:flip={{duration: 300}}>
          <MeetupItem 
              id={meetup.id}
              title={meetup.title} 
              subTitle={meetup.subTitle}
              description={meetup.description}
              imageUrl={meetup.imageUrl}
              email={meetup.email}
              address={meetup.address}
              isFavourite={meetup.isFavourite}
              on:edit={setEditMode}
          />
        </div>
      {/each}
  </section>

{/if}
