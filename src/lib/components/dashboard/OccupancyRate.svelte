<script lang="ts">
	import type { OccupanyRate } from '../../types/dashboard';
	import { RefreshCw, Eye } from 'lucide-svelte';
	import CardWidget from './CardWidget.svelte';
	import ProgressCircle from '../ui/ProgressCircle.svelte';

	// Props with defaults
	export let occupanyRate: OccupanyRate;

	function changeTimeFrame() {
		//TODO
	}
	function viewChartMode() {
		//TODO
		// Handle view chart mode
		console.log('View chart mode clicked');
	}
</script>

<CardWidget>
        <div>
            <div class="font-medium mb-5 text-xl"> Occupancy Rate</div>
          <div class="flex justify-between">
            <div>
              <ProgressCircle radius={70} percentage={occupanyRate.averageOccupanyRate} />
              <div class="my-1 font-bold text-black text-center">Average</div>
            </div>
            <div>
              <ProgressCircle radius={70} percentage={occupanyRate.averageLongTermRate} />
              <div class="my-1 font-bold text-black text-center">Long term rentals</div>
            </div>
          </div>
          <div class="flex justify-center mt-6">
            <div>
              <ProgressCircle radius={70} percentage={occupanyRate.averageShortTermRate} />
              <div class="my-1 font-bold text-black text-center">Short term rentals</div>
            </div>
          </div>
        </div>
</CardWidget>
